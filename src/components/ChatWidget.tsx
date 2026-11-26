import { useEffect, useRef, useState, type FormEvent } from 'react';
import {
  Check,
  Loader2,
  MessageSquare,
  RotateCcw,
  Send,
  Settings2,
  X,
} from 'lucide-react';
import type { OrderItem, ProductLineId } from '../data/catalog';

interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  text: string;
  time: string;
  isError?: boolean;
}

interface ChatWidgetProps {
  activeLine: ProductLineId;
  orderItems: OrderItem[];
}

const DEFAULT_WEBHOOK_URL =
  'https://n8n-n8n.fei69c.easypanel.host/webhook/abadikala-chat';
const STORAGE_KEY = 'abadikala_n8n_webhook_url';

const QUICK_PROMPTS = [
  'Rekomendasi buket Lini Segar hari ini',
  'Bagaimana cara preservasi buket ke Shadow-Box?',
  'Info lokasi, jam buka & area kirim Lhokseumawe',
];

function getTimeLabel(): string {
  return new Date().toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function createInitialMessages(): ChatMessage[] {
  return [
    {
      id: 'welcome',
      role: 'assistant',
      text: 'Halo, selamat datang di Abadikala Lhokseumawe. Ada yang bisa kami bantu terkait pilihan bunga segar Berastagi & Takengon, bunga awetan, atau layanan preservasi buket?',
      time: getTimeLabel(),
    },
  ];
}

function loadInitialWebhookUrl(): string {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)?.trim();
    return stored || DEFAULT_WEBHOOK_URL;
  } catch {
    return DEFAULT_WEBHOOK_URL;
  }
}

function extractReplyText(payload: unknown): string | null {
  const target = Array.isArray(payload) ? payload[0] : payload;

  if (typeof target === 'string') {
    const trimmed = target.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  if (target && typeof target === 'object') {
    const data = target as Record<string, unknown>;
    const candidate = data.reply || data.output || data.message;
    if (typeof candidate === 'string' && candidate.trim().length > 0) {
      return candidate.trim();
    }
  }

  return null;
}

export function ChatWidget(_props: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showWebhookPanel, setShowWebhookPanel] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState<string>(() =>
    loadInitialWebhookUrl(),
  );
  const [webhookInput, setWebhookInput] = useState<string>(() =>
    loadInitialWebhookUrl(),
  );
  const [webhookError, setWebhookError] = useState<string | null>(null);
  const [webhookSavedNotice, setWebhookSavedNotice] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    createInitialMessages(),
  );
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const isWebhookConfigured = webhookUrl.trim().length > 0;

  useEffect(() => {
    if (isOpen && !showWebhookPanel) {
      scrollAnchorRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [isOpen, showWebhookPanel, messages, isSending]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSaveWebhook = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = webhookInput.trim();
    setWebhookError(null);

    if (!trimmed) {
      setWebhookError('URL webhook tidak boleh kosong.');
      return;
    }

    try {
      const parsed = new URL(trimmed);
      if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
        setWebhookError('Gunakan URL webhook n8n berawalan https://.');
        return;
      }
    } catch {
      setWebhookError('Format URL belum valid.');
      return;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, trimmed);
    } catch {
      // Ignore storage restrictions
    }
    setWebhookUrl(trimmed);
    setWebhookSavedNotice(true);
    window.setTimeout(() => {
      setWebhookSavedNotice(false);
      setShowWebhookPanel(false);
    }, 900);
  };

  const handleRestoreDefaultWebhook = () => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage restrictions
    }
    setWebhookUrl(DEFAULT_WEBHOOK_URL);
    setWebhookInput(DEFAULT_WEBHOOK_URL);
    setWebhookError(null);
  };

  const sendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isSending) return;

    const targetUrl = webhookUrl.trim() || DEFAULT_WEBHOOK_URL;
    const recentMessages = messages
      .filter((m) => !m.isError)
      .slice(-4)
      .map((m) => ({
        role: m.role,
        content: m.text,
      }));

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
      time: getTimeLabel(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsSending(true);

    try {
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: trimmed,
          history: recentMessages,
        }),
      });

      const rawResponseText = await response.text();

      if (!response.ok) {
        const snippet = rawResponseText.trim().slice(0, 160);
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: 'assistant',
            text: `Gagal menghubungi webhook n8n (HTTP ${response.status})${
              snippet ? `: ${snippet}` : '.'
            }`,
            time: getTimeLabel(),
            isError: true,
          },
        ]);
        return;
      }

      let parsed: unknown = rawResponseText;
      try {
        parsed = JSON.parse(rawResponseText) as unknown;
      } catch {
        // Keep raw plain text if n8n returned text/plain
      }

      const botReply = extractReplyText(parsed);
      if (!botReply) {
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: 'assistant',
            text: `Respons webhook n8n tidak berisi teks balasan (HTTP ${response.status}). Pastikan respons mengembalikan properti reply, output, atau message.`,
            time: getTimeLabel(),
            isError: true,
          },
        ]);
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          text: botReply,
          time: getTimeLabel(),
        },
      ]);
    } catch (err) {
      const detail =
        err instanceof Error && err.message ? ` (${err.message})` : '';
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          text: `Gagal terhubung ke webhook n8n${detail}. Pastikan workflow n8n aktif dan Allowed Origins (CORS) pada node Webhook mengizinkan domain website ini.`,
          time: getTimeLabel(),
          isError: true,
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendMessage(input);
  };

  const handleResetChat = () => {
    setMessages(createInitialMessages());
    setInput('');
  };

  return (
    <>
      {/* Chat Panel */}
      {isOpen && (
        <section
          role="dialog"
          aria-label="Asisten Studio Abadikala"
          className="fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[390px] max-h-[min(580px,76vh)] bg-[#F7F3EE] border border-[#DCD3C9] rounded flex flex-col overflow-hidden"
        >
          {/* Editorial Header */}
          <div className="px-4 py-3.5 bg-[#EFE9E0] border-b border-[#DCD3C9] flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h2 className="font-editorial text-xl font-semibold text-[#2B2625] leading-tight truncate">
                Asisten Studio Abadikala
              </h2>
              <p
                className={`text-[11px] font-medium mt-0.5 truncate ${
                  isWebhookConfigured ? 'text-[#4B6345]' : 'text-[#6E655F]'
                }`}
              >
                {isWebhookConfigured
                  ? 'Terhubung • Studio Abadikala'
                  : 'URL Webhook belum diatur'}
              </p>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setWebhookInput(webhookUrl);
                  setWebhookError(null);
                  setShowWebhookPanel((prev) => !prev);
                }}
                aria-label="Pengaturan URL Webhook n8n"
                title="Pengaturan URL Webhook n8n"
                className={`p-2 rounded transition-colors cursor-pointer ${
                  showWebhookPanel
                    ? 'text-[#6D3B47] bg-[#F7F3EE]'
                    : 'text-[#6E655F] hover:text-[#2B2625]'
                }`}
              >
                <Settings2 className="w-4 h-4 stroke-[1.5]" />
              </button>
              <button
                type="button"
                onClick={handleResetChat}
                aria-label="Mulai ulang percakapan"
                title="Mulai ulang percakapan"
                className="p-2 text-[#6E655F] hover:text-[#2B2625] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 stroke-[1.5]" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Tutup jendela obrolan"
                className="p-2 text-[#6E655F] hover:text-[#2B2625] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[1.5]" />
              </button>
            </div>
          </div>

          {/* Manual Webhook URL Settings Panel */}
          {showWebhookPanel && (
            <form
              onSubmit={handleSaveWebhook}
              className="p-4 bg-[#EFE9E0]/65 border-b border-[#DCD3C9] space-y-2.5"
            >
              <div className="flex items-baseline justify-between gap-2">
                <label
                  htmlFor="n8n-webhook-url-input"
                  className="text-xs font-medium text-[#2B2625]"
                >
                  URL Webhook n8n (POST)
                </label>
                {webhookUrl !== DEFAULT_WEBHOOK_URL && (
                  <button
                    type="button"
                    onClick={handleRestoreDefaultWebhook}
                    className="text-[11px] text-[#6E655F] underline underline-offset-2 hover:text-[#6D3B47] cursor-pointer"
                  >
                    Kembalikan default
                  </button>
                )}
              </div>

              <input
                id="n8n-webhook-url-input"
                type="url"
                value={webhookInput}
                onChange={(e) => {
                  setWebhookInput(e.target.value);
                  setWebhookError(null);
                }}
                placeholder={DEFAULT_WEBHOOK_URL}
                className="w-full px-3 py-2 text-xs bg-[#F7F3EE] border border-[#DCD3C9] rounded text-[#2B2625] placeholder:text-[#6E655F]/70 focus:border-[#6D3B47] focus:outline-none"
              />

              {webhookError && (
                <p className="text-[11px] text-[#6D3B47] leading-snug">
                  {webhookError}
                </p>
              )}

              <div className="flex items-center justify-between gap-2 pt-1">
                <p className="text-[10px] text-[#6E655F] leading-snug">
                  Direct POST ke n8n · <code className="text-[#2B2625]">message</code>{' '}
                  &amp; <code className="text-[#2B2625]">history</code>.
                </p>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#6D3B47] text-[#F7F3EE] text-xs font-medium rounded hover:bg-[#572D37] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {webhookSavedNotice ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[2]" aria-hidden="true" />
                      <span>Tersimpan</span>
                    </>
                  ) : (
                    <span>Simpan URL</span>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Messages Thread */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 rounded text-sm leading-relaxed whitespace-pre-wrap ${
                      isUser
                        ? 'bg-[#6D3B47] text-[#F7F3EE]'
                        : msg.isError
                          ? 'bg-[#EFE9E0] border border-[#6D3B47]/55 text-[#2B2625]'
                          : 'bg-[#EFE9E0] border border-[#DCD3C9] text-[#2B2625]'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="mt-1 text-[10px] text-[#6E655F] tabular-nums px-0.5">
                    {isUser ? 'Anda' : 'Abadikala'} · {msg.time}
                  </span>
                </div>
              );
            })}

            {isSending && (
              <div className="flex items-start">
                <div className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded bg-[#EFE9E0] border border-[#DCD3C9] text-xs text-[#6E655F]">
                  <Loader2
                    className="w-3.5 h-3.5 stroke-[1.5] animate-spin text-[#6D3B47]"
                    aria-hidden="true"
                  />
                  <span>Menghubungi Studio Abadikala...</span>
                </div>
              </div>
            )}

            {/* Quick Starter Prompts on fresh chat */}
            {messages.length === 1 && !isSending && (
              <div className="pt-2 space-y-1.5">
                <p className="text-[11px] text-[#6E655F]">Pertanyaan cepat:</p>
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => void sendMessage(prompt)}
                    className="block w-full text-left px-3 py-2 text-xs text-[#2B2625] bg-[#F7F3EE] border border-[#DCD3C9] rounded hover:border-[#6D3B47] hover:text-[#6D3B47] transition-colors cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            <div ref={scrollAnchorRef} />
          </div>

          {/* Input Composer */}
          <form
            onSubmit={handleSubmit}
            className="p-3 bg-[#EFE9E0]/80 border-t border-[#DCD3C9]"
          >
            <div className="flex items-center gap-2">
              <label htmlFor="abadikala-chat-input" className="sr-only">
                Tulis pesan untuk Abadikala
              </label>
              <input
                ref={inputRef}
                id="abadikala-chat-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tanyakan stok bunga atau preservasi..."
                maxLength={2000}
                disabled={isSending}
                className="flex-1 px-3 py-2.5 text-sm bg-[#F7F3EE] border border-[#DCD3C9] rounded text-[#2B2625] placeholder:text-[#6E655F]/70 focus:border-[#6D3B47] focus:outline-none disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={isSending || !input.trim()}
                aria-label="Kirim pesan"
                className="p-2.5 bg-[#6D3B47] text-[#F7F3EE] rounded hover:bg-[#572D37] transition-colors disabled:opacity-50 cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4 stroke-[1.5]" />
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Tactile Editorial Floating Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Tutup obrolan Abadikala' : 'Buka obrolan Abadikala'}
        className="fixed bottom-5 right-4 sm:right-6 z-40 inline-flex items-center gap-2 rounded-full bg-[#6D3B47] text-[#F7F3EE] border border-[#572D37] px-4 py-2.5 text-xs sm:text-sm font-medium hover:bg-[#572D37] transition-colors duration-150 whitespace-nowrap cursor-pointer"
      >
        {isOpen ? (
          <>
            <X className="w-4 h-4 stroke-[1.5]" aria-hidden="true" />
            <span>Tutup Obrolan</span>
          </>
        ) : (
          <>
            <MessageSquare className="w-4 h-4 stroke-[1.5]" aria-hidden="true" />
            <span>Tanya Studio</span>
          </>
        )}
      </button>
    </>
  );
}
