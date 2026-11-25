import { useMemo, useState } from 'react';
import { Check, Copy, ExternalLink, Minus, Plus, Trash2 } from 'lucide-react';
import {
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  CATALOG_ITEMS,
  formatRupiah,
  type CatalogItem,
  type CustomerOrderForm,
  type OrderItem,
} from '../data/catalog';

interface OrderFooterSectionProps {
  orderItems: OrderItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onQuickAddCatalogItem: (item: CatalogItem) => void;
}

export function OrderFooterSection({
  orderItems,
  onUpdateQuantity,
  onRemoveItem,
  onQuickAddCatalogItem,
}: OrderFooterSectionProps) {
  const [form, setForm] = useState<CustomerOrderForm>({
    customerName: '',
    deliveryArea: '',
    deliveryDate: '',
    extraNotes: '',
  });
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);

  const grandTotal = useMemo(
    () => orderItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [orderItems],
  );

  const whatsappMessage = useMemo(
    () => buildWhatsAppMessage(orderItems, form),
    [orderItems, form],
  );

  const whatsappUrl = useMemo(
    () => buildWhatsAppUrl(whatsappMessage),
    [whatsappMessage],
  );

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(whatsappMessage);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setShowPreview(true);
    }
  };

  return (
    <footer id="pesan" className="bg-[#F7F3EE] pt-16 sm:pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pb-16 border-b border-[#DCD3C9]">
          {/* Column 1 (5 cols): Studio Location in Lhokseumawe, Aceh & Local Delivery Info */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <p className="text-xs text-[#6E655F] mb-2">
                Studio Lhokseumawe · Pemesanan &amp; Titip Preservasi
              </p>
              <h2 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#2B2625] leading-tight">
                Kunjungi studio Abadikala di Lhokseumawe
              </h2>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#6E655F]">
                Datang langsung untuk memilih tangkai segar dari chiller harian kami,
                mengambil pesanan, atau menitipkan buket momen spesial Anda untuk
                dipreservasi ke dalam bingkai shadow-box maupun blok resin.
              </p>

              <dl className="mt-8 space-y-6 pt-8 border-t border-[#DCD3C9]">
                <div>
                  <dt className="text-xs text-[#6E655F]">Alamat Studio</dt>
                  <dd className="mt-1 text-sm text-[#2B2625] leading-relaxed">
                    Jl. Merdeka Barat No. 24, Simpang Empat, Banda Sakti,
                    <br />
                    Kota Lhokseumawe, Aceh 24351
                  </dd>
                </div>

                <div>
                  <dt className="text-xs text-[#6E655F]">Jam Operasional</dt>
                  <dd className="mt-1 text-sm text-[#2B2625] leading-relaxed">
                    Setiap Hari, 09.00 – 20.00 WIB
                    <br />
                    <span className="text-[#6E655F]">
                      Pengiriman hari yang sama Lini Segar ditutup pukul 16.00 WIB
                    </span>
                  </dd>
                </div>

                <div>
                  <dt className="text-xs text-[#6E655F]">Jangkauan Pengantaran</dt>
                  <dd className="mt-1 text-sm text-[#2B2625] leading-relaxed">
                    Lini Segar: Banda Sakti, Muara Dua, Blang Mangat, Muara Satu,
                    Krueng Geukueh, hingga Lhoksukon. Lini Abadi (bingkai &amp; resin)
                    melayani pengiriman ke seluruh Aceh dan Indonesia.
                  </dd>
                </div>

                <div>
                  <dt className="text-xs text-[#6E655F]">Kontak Studio</dt>
                  <dd className="mt-1 text-sm text-[#2B2625] tabular-nums">
                    WhatsApp +62 811-6789-2410 · halo@abadikala.id
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Column 2 (7 cols): Interactive Order Summary & One-Click WhatsApp Generator */}
          <div className="lg:col-span-7">
            <div className="border border-[#DCD3C9] bg-[#EFE9E0]/55 rounded p-6 sm:p-8">
              <div className="flex flex-wrap items-baseline justify-between gap-2 pb-4 border-b border-[#DCD3C9]">
                <h3 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#2B2625]">
                  Ringkasan Pesanan WhatsApp
                </h3>
                <span className="text-xs text-[#6E655F] tabular-nums">
                  {orderItems.reduce((sum, i) => sum + i.quantity, 0)} item terpilih
                </span>
              </div>

              {/* Selected Items */}
              {orderItems.length === 0 ? (
                <div className="py-7 border-b border-[#DCD3C9]">
                  <p className="text-sm text-[#6E655F]">
                    Daftar pesanan Anda masih kosong. Pilih rangkaian dari katalog,
                    susun sendiri di Virtual Flower Bar, atau tambahkan langsung salah
                    satu pilihan utama berikut:
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {CATALOG_ITEMS.slice(0, 3).map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => onQuickAddCatalogItem(item)}
                        className="px-3 py-2 text-xs font-medium bg-[#F7F3EE] border border-[#DCD3C9] rounded text-[#2B2625] hover:border-[#6D3B47] hover:text-[#6D3B47] transition-colors cursor-pointer"
                      >
                        + {item.name} ({formatRupiah(item.price)})
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <ul className="divide-y divide-[#DCD3C9] border-b border-[#DCD3C9]">
                  {orderItems.map((item) => (
                    <li
                      key={item.id}
                      className="py-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                    >
                      <div className="min-w-0">
                        <p className="font-editorial text-xl font-semibold text-[#2B2625] leading-snug">
                          {item.name}
                        </p>
                        <p className="text-xs text-[#6E655F] mt-0.5">{item.subtitle}</p>
                        {item.isCustom && item.customDetails && (
                          <div className="mt-2 text-xs text-[#6E655F] space-y-0.5">
                            <p>
                              {item.customDetails.lineLabel} ·{' '}
                              {item.customDetails.deliverySlot}
                            </p>
                            {item.customDetails.includePreservationVoucher && (
                              <p className="text-[#7A8B74] font-medium">
                                + Termasuk reservasi preservasi Lini Abadi pasca-acara
                              </p>
                            )}
                            {item.customDetails.cardMessage.trim() && (
                              <p className="italic text-[#2B2625]">
                                Kartu: &ldquo;{item.customDetails.cardMessage.trim()}&rdquo;
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                        <div className="inline-flex items-center border border-[#DCD3C9] bg-[#F7F3EE] rounded">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            aria-label={`Kurangi jumlah ${item.name}`}
                            className="p-2 text-[#2B2625] hover:text-[#6D3B47] cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5 stroke-[1.5]" />
                          </button>
                          <span className="px-2.5 text-xs font-medium tabular-nums text-[#2B2625]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            aria-label={`Tambah jumlah ${item.name}`}
                            className="p-2 text-[#2B2625] hover:text-[#6D3B47] cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5 stroke-[1.5]" />
                          </button>
                        </div>

                        <span className="text-sm font-semibold text-[#2B2625] tabular-nums min-w-[96px] text-right">
                          {formatRupiah(item.unitPrice * item.quantity)}
                        </span>

                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.id)}
                          aria-label={`Hapus ${item.name}`}
                          className="p-1.5 text-[#6E655F] hover:text-[#6D3B47] cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4 stroke-[1.5]" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {/* Subtotal */}
              {orderItems.length > 0 && (
                <div className="py-4 border-b border-[#DCD3C9] flex items-baseline justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-[#2B2625]">
                      Estimasi Subtotal Pesanan
                    </p>
                    <p className="text-xs text-[#6E655F]">
                      Ongkos antar area Lhokseumawe &amp; sekitarnya diinformasikan via WhatsApp
                    </p>
                  </div>
                  <p className="text-xl font-semibold text-[#6D3B47] tabular-nums whitespace-nowrap">
                    {formatRupiah(grandTotal)}
                  </p>
                </div>
              )}

              {/* Customer Delivery Form */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="wa-name"
                    className="block text-xs font-medium text-[#2B2625] mb-1.5"
                  >
                    Nama Pemesan
                  </label>
                  <input
                    id="wa-name"
                    type="text"
                    value={form.customerName}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, customerName: e.target.value }))
                    }
                    placeholder="Nama lengkap Anda"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#F7F3EE] border border-[#DCD3C9] rounded text-[#2B2625] placeholder:text-[#6E655F]/70 focus:border-[#6D3B47] focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="wa-date"
                    className="block text-xs font-medium text-[#2B2625] mb-1.5"
                  >
                    Tanggal Pengantaran / Ambil
                  </label>
                  <input
                    id="wa-date"
                    type="date"
                    value={form.deliveryDate}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, deliveryDate: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 text-sm bg-[#F7F3EE] border border-[#DCD3C9] rounded text-[#2B2625] focus:border-[#6D3B47] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="wa-area"
                    className="block text-xs font-medium text-[#2B2625] mb-1.5"
                  >
                    Alamat Pengantaran atau Ambil di Studio
                  </label>
                  <input
                    id="wa-area"
                    type="text"
                    value={form.deliveryArea}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, deliveryArea: e.target.value }))
                    }
                    placeholder="Misal: Banda Sakti, Lhokseumawe / Ambil di Studio Jl. Merdeka Barat"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#F7F3EE] border border-[#DCD3C9] rounded text-[#2B2625] placeholder:text-[#6E655F]/70 focus:border-[#6D3B47] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="wa-notes"
                    className="block text-xs font-medium text-[#2B2625] mb-1.5"
                  >
                    Catatan Tambahan (Opsional)
                  </label>
                  <input
                    id="wa-notes"
                    type="text"
                    value={form.extraNotes}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, extraNotes: e.target.value }))
                    }
                    placeholder="Misal: nuansa warna lembut, kirim sebelum acara wisuda pukul 10.00"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#F7F3EE] border border-[#DCD3C9] rounded text-[#2B2625] placeholder:text-[#6E655F]/70 focus:border-[#6D3B47] focus:outline-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#6D3B47] text-[#F7F3EE] px-6 py-3.5 rounded text-sm font-medium hover:bg-[#572D37] transition-colors duration-150 whitespace-nowrap"
                >
                  <span>Pesan via WhatsApp</span>
                  <ExternalLink className="w-4 h-4 stroke-[1.5]" aria-hidden="true" />
                </a>

                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="inline-flex items-center justify-center gap-2 border border-[#DCD3C9] bg-[#F7F3EE] text-[#2B2625] px-5 py-3.5 rounded text-sm font-medium hover:border-[#6D3B47] hover:text-[#6D3B47] transition-colors duration-150 whitespace-nowrap cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check
                        className="w-4 h-4 stroke-[1.75] text-[#7A8B74]"
                        aria-hidden="true"
                      />
                      <span>Teks Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 stroke-[1.5]" aria-hidden="true" />
                      <span>Salin Pesan</span>
                    </>
                  )}
                </button>
              </div>

              {/* Collapsible Formatted WhatsApp Message Preview */}
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => setShowPreview((prev) => !prev)}
                  className="text-xs text-[#6E655F] underline underline-offset-4 hover:text-[#2B2625] cursor-pointer"
                >
                  {showPreview
                    ? 'Sembunyikan pratinjau pesan WhatsApp'
                    : 'Lihat format pesan WhatsApp yang akan dikirim'}
                </button>

                {showPreview && (
                  <pre className="mt-3 p-4 bg-[#F7F3EE] border border-[#DCD3C9] rounded text-xs text-[#2B2625] whitespace-pre-wrap font-sans leading-relaxed">
                    {whatsappMessage}
                  </pre>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quiet Copyright & Anchor Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#6E655F]">
          <p>
            © {new Date().getFullYear()} Abadikala — Segar Hari Ini, Abadi Selamanya ·
            Lhokseumawe, Aceh.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <a href="#konsep" className="hover:text-[#2B2625] transition-colors">
              Konsep
            </a>
            <a href="#pasokan" className="hover:text-[#2B2625] transition-colors">
              Pasokan
            </a>
            <a href="#katalog" className="hover:text-[#2B2625] transition-colors">
              Katalog
            </a>
            <a
              href="#virtual-flower-bar"
              className="hover:text-[#2B2625] transition-colors"
            >
              Virtual Flower Bar
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
