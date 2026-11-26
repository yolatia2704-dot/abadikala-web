import { useEffect, useRef, useState, type FormEvent } from 'react';
import {
  Loader2,
  MessageSquare,
  RotateCcw,
  Send,
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

function createSessionId(): string {
  const randomPart = Math.random().toString(36).slice(2, 10);
  return `abk_${Date.now().toString(36)}_${randomPart}`;
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

export function ChatWidget({ activeLine, orderItems }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    createInitialMessages(),
  );
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [n8nConnected, setN8nConnected] = useState<boolean | null>(null);
  const sessionIdRef = useRef<string>(createSessionId());
  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/chat/status')
      .then((res) => (res.ok ? res.json() : { connected: false }))
      .then((data: { connected?: boolean }) => {
        if (!cancelled) {
          setN8nConnected(Boolean(data.connected));
        }
      })
      .catch(() => {
        if (!cancelled) setN8nConnected(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollAnchorRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [isOpen, messages, isSending]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const sendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isSending) return;

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
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          sessionId: sessionIdRef.current,
          context: {
            activeLine,
            cartItemCount: orderItems.reduce((sum, i) => sum + i.quantity, 0),
            cartSummary: orderItems.map((i) => `${i.name} (${i.quantity}x)`),
          },
        }),
      });

      const data = (await response.json()) as {
        reply?: string;
        error?: string;
        connected?: boolean;
      };

      if (typeof data.connected === 'boolean') {
        setN8nConnected(data.connected);
      }

      if (!response.ok) {
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: 'assistant',
            text:
              data.error ||
              'Maaf, terjadi kendala saat menghubungi asisten studio. Anda juga dapat langsung memesan melalui tombol WhatsApp.',
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
          text:
            data.reply ||
            'Pesan Anda sudah diterima oleh studio Abadikala.',
          time: getTimeLabel(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          text: 'Koneksi ke server sedang terganggu. Silakan coba kirim ulang pesan Anda beberapa saat lagi.',
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
    sessionIdRef.current = createSessionId();
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
          className="fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[390px] max-h-[min(560px,74vh)] bg-[#F7F3EE] border border-[#DCD3C9] rounded flex flex-col overflow-hidden"
        >
          {/* Editorial Header */}
          <div className="px-4 py-3.5 bg-[#EFE9E0] border-b border-[#DCD3C9] flex items-center justify-between gap-3">
            <div>
              <h2 className="font-editorial text-xl font-semibold text-[#2B2625] leading-tight">
                Asisten Studio Abadikala
              </h2>
              <p className="text-[11px] text-[#6E655F] mt-0.5">
                {n8nConnected
                  ? 'Terhubung via webhook n8n · Lhokseumawe'
                  : 'Pratinjau lokal · Siap hubungkan webhook n8n'}
              </p>
            </div>

            <div className="flex items-center gap-1 shrink-0">
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
                          ? 'bg-[#EFE9E0] border border-[#6D3B47]/45 text-[#2B2625]'
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
                  <span>Menghubungi studio...</span>
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

            {n8nConnected === false && (
              <p className="mt-2 text-[10px] text-[#6E655F] leading-snug">
                Tambahkan <code className="text-[#2B2625]">N8N_WEBHOOK_URL</code> di
                pengaturan Secrets agar obrolan diteruskan langsung ke workflow n8n Anda.
              </p>
            )}
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
