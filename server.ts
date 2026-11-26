import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import dns from 'node:dns/promises';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const REQUEST_TIMEOUT_MS = 25000;
const MAX_MESSAGE_LENGTH = 2000;
const MAX_HISTORY_ITEMS = 4;

export const DEFAULT_N8N_WEBHOOK_URL =
  'https://n8n-n8n.fei69c.easypanel.host/webhook/abadikala-chat';

interface HistoryItem {
  role: 'user' | 'assistant';
  content: string;
}

function isPrivateIpAddress(ip: string): boolean {
  const normalized = ip.toLowerCase().replace(/^::ffff:/, '');
  const version = net.isIP(normalized);

  if (version === 4) {
    const parts = normalized.split('.').map(Number);
    if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) return true;
    const [a, b] = parts;
    if (a === 0 || a === 10 || a === 127) return true;
    if (a === 100 && b >= 64 && b <= 127) return true; // CGNAT 100.64.0.0/10
    if (a === 169 && b === 254) return true; // Link-local / cloud metadata
    if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12
    if (a === 192 && b === 168) return true; // 192.168.0.0/16
    if (a >= 224) return true; // Multicast / reserved
    return false;
  }

  if (version === 6) {
    if (
      normalized === '::' ||
      normalized === '::1' ||
      normalized.startsWith('fe80:') ||
      normalized.startsWith('fc') ||
      normalized.startsWith('fd') ||
      normalized.startsWith('ff')
    ) {
      return true;
    }
    return false;
  }

  return true;
}

function isBlockedHostname(hostname: string): boolean {
  const lower = hostname.toLowerCase().replace(/^\[|\]$/g, '');
  if (
    !lower ||
    lower === 'localhost' ||
    lower === '0.0.0.0' ||
    lower === '::1' ||
    lower.endsWith('.local') ||
    lower.endsWith('.internal') ||
    lower.endsWith('.localhost')
  ) {
    return true;
  }

  if (net.isIP(lower) !== 0) {
    return isPrivateIpAddress(lower);
  }

  return false;
}

async function resolveAndValidateWebhookUrl(
  rawUrl: string | undefined,
): Promise<URL | null> {
  const trimmed = rawUrl?.trim();
  if (!trimmed) return null;

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return null;
  }

  if (parsed.protocol !== 'https:') {
    return null;
  }

  if (parsed.username || parsed.password) {
    return null;
  }

  if (isBlockedHostname(parsed.hostname)) {
    return null;
  }

  if (!/\/webhook(-test)?(\/|$)/i.test(parsed.pathname)) {
    return null;
  }

  try {
    const records = await dns.lookup(parsed.hostname, { all: true });
    if (records.length === 0) return null;
    for (const record of records) {
      if (isPrivateIpAddress(record.address)) {
        return null;
      }
    }
  } catch {
    return null;
  }

  return parsed;
}

function sanitizeHistory(raw: unknown): HistoryItem[] {
  if (!Array.isArray(raw)) return [];
  const cleaned: HistoryItem[] = [];

  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const record = item as Record<string, unknown>;
    const role = record.role;
    const content =
      typeof record.content === 'string' ? record.content.trim() : '';

    if ((role === 'user' || role === 'assistant') && content.length > 0) {
      cleaned.push({
        role,
        content: content.slice(0, MAX_MESSAGE_LENGTH),
      });
    }
  }

  return cleaned.slice(-MAX_HISTORY_ITEMS);
}

function extractN8nReply(payload: unknown): string | null {
  const target = Array.isArray(payload) ? payload[0] : payload;

  if (typeof target === 'string') {
    const trimmed = target.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  if (target && typeof target === 'object') {
    const data = target as Record<string, unknown>;
    const reply = data.reply || data.output || data.message;
    if (typeof reply === 'string' && reply.trim().length > 0) {
      return reply.trim();
    }
  }

  return null;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '32kb' }));

  app.get('/api/chat/status', (_req: Request, res: Response) => {
    const defaultUrl =
      process.env.N8N_WEBHOOK_URL?.trim() || DEFAULT_N8N_WEBHOOK_URL;
    res.json({
      defaultWebhookUrl: defaultUrl,
      connected: Boolean(defaultUrl),
    });
  });

  app.post('/api/chat', async (req: Request, res: Response) => {
    const body = req.body as Record<string, unknown> | undefined;
    const rawMessage =
      typeof body?.message === 'string' ? body.message.trim() : '';
    const clientWebhookUrl =
      typeof body?.webhookUrl === 'string' ? body.webhookUrl.trim() : '';

    if (!rawMessage) {
      res.status(400).json({
        error: 'Pesan tidak boleh kosong.',
        httpStatus: 400,
      });
      return;
    }

    if (rawMessage.length > MAX_MESSAGE_LENGTH) {
      res.status(400).json({
        error: `Pesan terlalu panjang (maksimal ${MAX_MESSAGE_LENGTH} karakter).`,
        httpStatus: 400,
      });
      return;
    }

    const history = sanitizeHistory(body?.history);
    const chosenUrl =
      clientWebhookUrl ||
      process.env.N8N_WEBHOOK_URL?.trim() ||
      DEFAULT_N8N_WEBHOOK_URL;

    const targetWebhookUrl = await resolveAndValidateWebhookUrl(chosenUrl);
    if (!targetWebhookUrl) {
      res.status(400).json({
        error:
          'URL webhook tidak valid. Pastikan menggunakan URL HTTPS publik n8n dengan jalur /webhook/ atau /webhook-test/.',
        httpStatus: 400,
      });
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const upstreamRes = await fetch(targetWebhookUrl.toString(), {
        method: 'POST',
        redirect: 'error',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        body: JSON.stringify({
          message: rawMessage,
          history,
        }),
      });

      const rawText = await upstreamRes.text();

      if (!upstreamRes.ok) {
        const shortSnippet = rawText.trim().slice(0, 180);
        res.status(upstreamRes.status).json({
          error: `Webhook n8n merespons gagal (HTTP ${upstreamRes.status})${
            shortSnippet ? `: ${shortSnippet}` : '.'
          }`,
          httpStatus: upstreamRes.status,
        });
        return;
      }

      let parsed: unknown = null;
      try {
        parsed = JSON.parse(rawText) as unknown;
      } catch {
        parsed = rawText;
      }

      const reply = extractN8nReply(parsed);
      if (!reply) {
        res.status(502).json({
          error:
            'Respons dari webhook n8n kosong atau tidak memiliki properti reply, output, maupun message (HTTP 502).',
          httpStatus: 502,
        });
        return;
      }

      res.json({
        reply,
        httpStatus: upstreamRes.status,
      });
    } catch (err) {
      const isTimeout = err instanceof Error && err.name === 'AbortError';
      const status = isTimeout ? 504 : 502;
      res.status(status).json({
        error: isTimeout
          ? `Waktu tunggu respons webhook n8n habis (HTTP ${status}).`
          : `Tidak dapat menjangkau endpoint webhook n8n (HTTP ${status}). Periksa status aktif workflow n8n Anda.`,
        httpStatus: status,
      });
    } finally {
      clearTimeout(timeoutId);
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Abadikala server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
