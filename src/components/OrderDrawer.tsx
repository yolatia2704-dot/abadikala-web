import { useEffect } from 'react';
import { ArrowRight, Minus, Plus, Trash2, X } from 'lucide-react';
import { formatRupiah, type OrderItem } from '../data/catalog';

interface OrderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  orderItems: OrderItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
}

export function OrderDrawer({
  isOpen,
  onClose,
  orderItems,
  onUpdateQuantity,
  onRemoveItem,
}: OrderDrawerProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const totalAmount = orderItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Ringkasan Pesanan Abadikala"
    >
      <div
        className="fixed inset-0 bg-[#2B2625]/35"
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className="relative z-10 w-full max-w-md bg-[#F7F3EE] border-l border-[#DCD3C9] h-full flex flex-col">
        <div className="px-6 py-5 border-b border-[#DCD3C9] flex items-center justify-between gap-4">
          <div>
            <h2 className="font-editorial text-2xl font-semibold text-[#2B2625]">
              Ringkasan Pesanan
            </h2>
            <p className="text-xs text-[#6E655F] mt-0.5">
              Abadikala · Lhokseumawe, Aceh
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup panel pesanan"
            className="p-2 text-[#6E655F] hover:text-[#2B2625] cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {orderItems.length === 0 ? (
            <div className="py-12 text-center">
              <p className="font-editorial text-xl font-semibold text-[#2B2625]">
                Daftar pesanan masih kosong
              </p>
              <p className="mt-2 text-sm text-[#6E655F] leading-relaxed">
                Tambahkan rangkaian Lini Segar maupun Lini Abadi dari katalog, atau
                rancang sendiri di Virtual Flower Bar.
              </p>
              <div className="mt-6 flex flex-col gap-2.5">
                <a
                  href="#katalog"
                  onClick={onClose}
                  className="px-4 py-2.5 text-sm font-medium border border-[#6D3B47] text-[#6D3B47] rounded hover:bg-[#6D3B47] hover:text-[#F7F3EE] transition-colors"
                >
                  Lihat Katalog Abadikala
                </a>
                <a
                  href="#virtual-flower-bar"
                  onClick={onClose}
                  className="px-4 py-2.5 text-sm font-medium bg-[#EFE9E0] border border-[#DCD3C9] text-[#2B2625] rounded hover:border-[#6D3B47] transition-colors"
                >
                  Buka Virtual Flower Bar
                </a>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-[#DCD3C9]">
              {orderItems.map((item) => (
                <li key={item.id} className="py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-editorial text-lg font-semibold text-[#2B2625] leading-snug">
                        {item.name}
                      </p>
                      <p className="text-xs text-[#6E655F] mt-0.5">{item.subtitle}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      aria-label={`Hapus ${item.name}`}
                      className="p-1 text-[#6E655F] hover:text-[#6D3B47] cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4 stroke-[1.5]" />
                    </button>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-4">
                    <div className="inline-flex items-center border border-[#DCD3C9] bg-[#EFE9E0]/60 rounded">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        aria-label={`Kurangi jumlah ${item.name}`}
                        className="p-1.5 text-[#2B2625] hover:text-[#6D3B47] cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5 stroke-[1.5]" />
                      </button>
                      <span className="px-2.5 text-xs font-medium tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        aria-label={`Tambah jumlah ${item.name}`}
                        className="p-1.5 text-[#2B2625] hover:text-[#6D3B47] cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[1.5]" />
                      </button>
                    </div>

                    <span className="text-sm font-semibold text-[#2B2625] tabular-nums">
                      {formatRupiah(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="p-6 border-t border-[#DCD3C9] bg-[#EFE9E0]/60">
          <div className="flex items-baseline justify-between gap-4 mb-4">
            <span className="text-sm text-[#6E655F]">Estimasi Total</span>
            <span className="text-xl font-semibold text-[#6D3B47] tabular-nums">
              {formatRupiah(totalAmount)}
            </span>
          </div>

          <a
            href="#pesan"
            onClick={onClose}
            className="w-full inline-flex items-center justify-center gap-2 bg-[#6D3B47] text-[#F7F3EE] px-5 py-3 rounded text-sm font-medium hover:bg-[#572D37] transition-colors"
          >
            <span>Lanjut ke Format WhatsApp</span>
            <ArrowRight className="w-4 h-4 stroke-[1.5]" aria-hidden="true" />
          </a>
        </div>
      </aside>
    </div>
  );
}
