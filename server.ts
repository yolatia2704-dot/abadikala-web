import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const REQUEST_TIMEOUT_MS = 20000;
const MAX_MESSAGE_LENGTH = 2000;

interface ChatContextPayload {
  activeLine?: string;
  cartItemCount?: number;
  cartSummary?: string[];
}

function isPrivateOrBlockedHost(hostname: string): boolean {
  const lower = hostname.toLowerCase().replace(/^\[|\]$/g, '');
  if (
    lower === 'localhost' ||
    lower === '0.0.0.0' ||
    lower === '::1' ||
    lower.endsWith('.local') ||
    lower.endsWith('.internal')
  ) {
    return true;
  }

  const ipVersion = net.isIP(lower);
  if (ipVersion === 4) {
    const parts = lower.split('.').map(Number);
    if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) return true;
    const [a, b] = parts;
    if (a === 10) return true; // 10.0.0.0/8
    if (a === 127) return true; // 127.0.0.0/8
    if (a === 169 && b === 254) return true; // 169.254.0.0/16 metadata / link-local
    if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12
    if (a === 192 && b === 168) return true; // 192.168.0.0/16
    if (a === 0) return true;
  }

  if (ipVersion === 6) {
    if (
      lower === '::1' ||
      lower.startsWith('fe80:') ||
      lower.startsWith('fc') ||
      lower.startsWith('fd')
    ) {
      return true;
    }
  }

  return false;
}

function getValidatedWebhookUrl(): URL | null {
  const raw = process.env.N8N_WEBHOOK_URL?.trim();
  if (!raw) return null;

  try {
    const parsed = new URL(raw);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return null;
    }
    if (isPrivateOrBlockedHost(parsed.hostname)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function extractReplyFromN8nPayload(payload: unknown): string | null {
  if (typeof payload === 'string') {
    const trimmed = payload.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  if (Array.isArray(payload)) {
    for (const entry of payload) {
      const extracted = extractReplyFromN8nPayload(entry);
      if (extracted) return extracted;
    }
    return null;
  }

  if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>;
    const candidateKeys = [
      'output',
      'reply',
      'text',
      'response',
      'message',
      'answer',
      'content',
    ];
    for (const key of candidateKeys) {
      const value = record[key];
      if (typeof value === 'string' && value.trim().length > 0) {
        return value.trim();
      }
    }
    if (record.data) {
      return extractReplyFromN8nPayload(record.data);
    }
  }

  return null;
}

function buildLocalStudioReply(message: string): string {
  const lower = message.toLowerCase();

  if (
    lower.includes('preservasi') ||
    lower.includes('shadow') ||
    lower.includes('awet') ||
    lower.includes('resin') ||
    lower.includes('pressed')
  ) {
    return (
      'Untuk Lini Abadi, kami menyediakan Bingkai Shadow-Box 3D Kayu Alami (Rp 485.000), Bingkai Pressed Flower (Rp 320.000), Set Resin Botani (Rp 210.000), serta Jasa Preservasi Buket Anda (Rp 425.000). ' +
      'Jika ingin mengawetkan buket acara, silakan antar buket ke studio Lhokseumawe maksimal 48 jam setelah acara agar warna kelopak tetap terjaga.'
    );
  }

  if (
    lower.includes('segar') ||
    lower.includes('buket') ||
    lower.includes('berastagi') ||
    lower.includes('takengon') ||
    lower.includes('harga') ||
    lower.includes('rekomendasi')
  ) {
    return (
      'Stok Lini Segar kami dipasok dari dataran tinggi Berastagi & Takengon dengan penyimpanan chiller 4–6°C. ' +
      'Pilihan terfavorit saat ini: Buket Saku Harian Takengon (Rp 135.000), Buket Korean Wrap Mawar Berastagi (Rp 265.000), dan Buket Editorial Marun (Rp 365.000). ' +
      'Anda juga dapat menyusun sendiri komposisinya di bagian Virtual Flower Bar.'
    );
  }

  if (
    lower.includes('lokasi') ||
    lower.includes('alamat') ||
    lower.includes('ongkir') ||
    lower.includes('kirim') ||
    lower.includes('buka') ||
    lower.includes('jam')
  ) {
    return (
      'Studio Abadikala berlokasi di Jl. Merdeka Barat No. 24, Simpang Empat, Banda Sakti, Kota Lhokseumawe, Aceh (buka setiap hari 09.00–20.00 WIB). ' +
      'Pengantaran Lini Segar menjangkau Banda Sakti, Muara Dua, Blang Mangat, Muara Satu, Krueng Geukueh, hingga Lhoksukon—pesanan hari yang sama ditutup pukul 16.00 WIB.'
    );
  }

  return (
    'Terima kasih telah menghubungi Abadikala Lhokseumawe. Saya dapat membantu informasi mengenai buket Lini Segar (Berastagi & Takengon), Lini Abadi (Shadow-Box, Pressed Flower, Resin), jadwal pengiriman Lhokseumawe, atau layanan preservasi buket. ' +
    'Silakan tanyakan detail kebutuhan Anda, atau kirim ringkasan pesanan langsung melalui tombol WhatsApp.'
  );
}

function sanitizeContext(raw: unknown): ChatContextPayload {
  if (!raw || typeof raw !== 'object') return {};
  const obj = raw as Record<string, unknown>;
  const activeLine =
    obj.activeLine === 'segar' || obj.activeLine === 'abadi'
      ? obj.activeLine
      : undefined;
  const cartItemCount =
    typeof obj.cartItemCount === 'number' &&
    Number.isFinite(obj.cartItemCount) &&
    obj.cartItemCount >= 0
      ? Math.min(Math.floor(obj.cartItemCount), 99)
      : 0;
  const cartSummary = Array.isArray(obj.cartSummary)
    ? obj.cartSummary
        .filter((item): item is string => typeof item === 'string')
        .slice(0, 10)
        .map((item) => item.slice(0, 120))
    : [];

  return { activeLine, cartItemCount, cartSummary };
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '32kb' }));

  app.get('/api/chat/status', (_req: Request, res: Response) => {
    const webhookUrl = getValidatedWebhookUrl();
    res.json({
      connected: webhookUrl !== null,
    });
  });

  app.post('/api/chat', async (req: Request, res: Response) => {
    const body = req.body as Record<string, unknown> | undefined;
    const rawMessage = typeof body?.message === 'string' ? body.message.trim() : '';
    const rawSessionId =
      typeof body?.sessionId === 'string' ? body.sessionId.trim() : '';

    if (!rawMessage) {
      res.status(400).json({ error: 'Pesan tidak boleh kosong.' });
      return;
    }

    if (rawMessage.length > MAX_MESSAGE_LENGTH) {
      res.status(400).json({
        error: `Pesan terlalu panjang (maksimal ${MAX_MESSAGE_LENGTH} karakter).`,
      });
      return;
    }

    const sessionId = /^[a-zA-Z0-9_-]{8,64}$/.test(rawSessionId)
      ? rawSessionId
      : `web_${Date.now()}`;

    const context = sanitizeContext(body?.context);
    const webhookUrl = getValidatedWebhookUrl();

    if (!webhookUrl) {
      res.json({
        reply: buildLocalStudioReply(rawMessage),
        mode: 'local-fallback',
        connected: false,
      });
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/plain',
      };

      const webhookSecret = process.env.N8N_WEBHOOK_SECRET?.trim();
      if (webhookSecret) {
        if (process.env.N8N_WEBHOOK_AUTH_MODE?.toLowerCase() === 'bearer') {
          headers.Authorization = `Bearer ${webhookSecret}`;
        } else {
          headers['X-Webhook-Secret'] = webhookSecret;
        }
      }

      const upstreamRes = await fetch(webhookUrl.toString(), {
        method: 'POST',
        headers,
        signal: controller.signal,
        body: JSON.stringify({
          chatInput: rawMessage,
          message: rawMessage,
          sessionId,
          source: 'abadikala-web',
          timestamp: new Date().toISOString(),
          context,
        }),
      });

      const contentType = upstreamRes.headers.get('content-type') || '';
      const rawText = await upstreamRes.text();

      if (!upstreamRes.ok) {
        res.status(502).json({
          error:
            'Webhook n8n sedang tidak dapat dihubungi. Silakan coba beberapa saat lagi atau hubungi via WhatsApp.',
        });
        return;
      }

      let reply: string | null = null;
      if (contentType.includes('application/json')) {
        try {
          const parsed = JSON.parse(rawText) as unknown;
          reply = extractReplyFromN8nPayload(parsed);
        } catch {
          reply = rawText.trim() || null;
        }
      } else {
        reply = rawText.trim() || null;
      }

      res.json({
        reply:
          reply ||
          'Pesan Anda telah diterima oleh sistem Abadikala. Tim studio kami akan segera menindaklanjuti.',
        mode: 'n8n',
        connected: true,
      });
    } catch (err) {
      const isTimeout = err instanceof Error && err.name === 'AbortError';
      res.status(isTimeout ? 504 : 502).json({
        error: isTimeout
          ? 'Waktu tunggu balasan webhook n8n habis. Mohon coba kirim ulang pesan Anda.'
          : 'Gagal terhubung ke webhook n8n. Periksa kembali N8N_WEBHOOK_URL di konfigurasi server.',
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
