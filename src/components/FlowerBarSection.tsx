import { useMemo, useState } from 'react';
import { Check, RotateCcw } from 'lucide-react';
import {
  BUILDER_FINISHES,
  BUILDER_FLOWERS,
  BUILDER_SIZES,
  DELIVERY_SLOTS,
  formatRupiah,
  type DeliverySlot,
  type OrderItem,
  type ProductLineId,
} from '../data/catalog';
import { BouquetPreviewSvg } from './BouquetPreviewSvg';

interface FlowerBarSectionProps {
  onAddCustomBouquet: (item: OrderItem) => void;
}

const PRESERVATION_BOOKING_FEE = 175000;

export function FlowerBarSection({ onAddCustomBouquet }: FlowerBarSectionProps) {
  const [line, setLine] = useState<ProductLineId>('segar');
  const [sizeId, setSizeId] = useState<'petite' | 'klasik' | 'istimewa'>('klasik');
  const [selectedFlowerIds, setSelectedFlowerIds] = useState<string[]>([
    'mawar-blush',
    'mawar-gading',
  ]);
  const [finishId, setFinishId] = useState<string>('korean-linen');
  const [includePreservationVoucher, setIncludePreservationVoucher] = useState(false);
  const [deliverySlot, setDeliverySlot] = useState<DeliverySlot>(DELIVERY_SLOTS[0]);
  const [cardTo, setCardTo] = useState('');
  const [cardMessage, setCardMessage] = useState('');
  const [cardFrom, setCardFrom] = useState('');
  const [addedFeedback, setAddedFeedback] = useState(false);

  const availableFinishes = useMemo(
    () => BUILDER_FINISHES.filter((f) => f.line === line),
    [line],
  );

  const activeFinish =
    availableFinishes.find((f) => f.id === finishId) ?? availableFinishes[0];

  const activeSize =
    BUILDER_SIZES.find((s) => s.id === sizeId) ?? BUILDER_SIZES[1];

  const activeFlowers = useMemo(
    () => BUILDER_FLOWERS.filter((f) => selectedFlowerIds.includes(f.id)),
    [selectedFlowerIds],
  );

  const flowersSubtotal = useMemo(
    () => activeFlowers.reduce((sum, f) => sum + f.price, 0),
    [activeFlowers],
  );

  const preservationFee =
    line === 'segar' && includePreservationVoucher ? PRESERVATION_BOOKING_FEE : 0;

  const totalPrice =
    activeSize.price + flowersSubtotal + activeFinish.price + preservationFee;

  const handleLineSwitch = (nextLine: ProductLineId) => {
    setLine(nextLine);
    const firstFinish = BUILDER_FINISHES.find((f) => f.line === nextLine);
    if (firstFinish) setFinishId(firstFinish.id);
    if (nextLine === 'abadi') {
      setIncludePreservationVoucher(false);
    }
  };

  const toggleFlower = (id: string) => {
    setSelectedFlowerIds((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev;
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), id];
      }
      return [...prev, id];
    });
  };

  const handleReset = () => {
    setLine('segar');
    setSizeId('klasik');
    setSelectedFlowerIds(['mawar-blush', 'mawar-gading']);
    setFinishId('korean-linen');
    setIncludePreservationVoucher(false);
    setDeliverySlot(DELIVERY_SLOTS[0]);
    setCardTo('');
    setCardMessage('');
    setCardFrom('');
  };

  const handleCommitCustomOrder = () => {
    const lineLabel =
      line === 'segar'
        ? 'Lini Segar (Bunga untuk Hari Ini)'
        : 'Lini Abadi (Bunga Awetan)';
    const scaleDetail =
      line === 'segar' ? activeSize.segarLabel : activeSize.abadiLabel;

    const customItem: OrderItem = {
      id: `custom-${Date.now()}`,
      name: `Virtual Flower Bar — ${line === 'segar' ? 'Buket Segar' : 'Karya Abadi'} ${activeSize.name}`,
      subtitle: `${activeFlowers.map((f) => f.name).join(' + ')} · ${activeFinish.name}`,
      unitPrice: totalPrice,
      quantity: 1,
      isCustom: true,
      customDetails: {
        lineLabel,
        sizeName: `${activeSize.name} (${scaleDetail})`,
        flowers: activeFlowers.map((f) => f.name),
        finishName: activeFinish.name,
        deliverySlot,
        cardTo,
        cardMessage,
        cardFrom,
        includePreservationVoucher: line === 'segar' && includePreservationVoucher,
      },
    };

    onAddCustomBouquet(customItem);
    setAddedFeedback(true);
    window.setTimeout(() => setAddedFeedback(false), 1800);
  };

  return (
    <section
      id="virtual-flower-bar"
      className="bg-[#EFE9E0] border-y border-[#DCD3C9] py-16 sm:py-24"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        {/* Section Intro */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-[#DCD3C9]">
          <div className="max-w-2xl">
            <p className="text-xs text-[#6E655F] mb-2">
              Virtual Flower Bar · Satu Bunga, Dua Bentuk Produk
            </p>
            <h2
              className="font-editorial text-3xl sm:text-4xl font-semibold text-[#2B2625] leading-tight"
              style={{ textWrap: 'balance' }}
            >
              Rancang rangkaian segar atau kenangan abadi Anda
            </h2>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6E655F] hover:text-[#2B2625] transition-colors self-start md:self-auto cursor-pointer whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5 stroke-[1.5]" aria-hidden="true" />
            <span>Ulangi rancangan</span>
          </button>
        </div>

        {/* Main 12-Col Configurator Workspace */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column (7 cols): Interactive Steps */}
          <div className="lg:col-span-7 space-y-10">
            {/* Step 1: Choose Product Line (Lini Segar vs Lini Abadi) */}
            <div>
              <div className="flex items-baseline justify-between gap-4 mb-4">
                <h3 className="font-editorial text-2xl font-semibold text-[#2B2625]">
                  1. Pilih bentuk produk
                </h3>
                <span className="text-xs text-[#6E655F]">
                  Lini Segar atau Lini Abadi
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <button
                  type="button"
                  onClick={() => handleLineSwitch('segar')}
                  className={`text-left p-4 rounded border transition-colors duration-150 cursor-pointer ${
                    line === 'segar'
                      ? 'bg-[#F7F3EE] border-[#6D3B47]'
                      : 'bg-[#F7F3EE]/55 border-[#DCD3C9] hover:border-[#6E655F]'
                  }`}
                >
                  <p className="font-editorial text-xl font-semibold text-[#2B2625]">
                    Lini Segar — Untuk Hari Ini
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#6E655F]">
                    Buket tangan atau vas keramik dari bunga potong segar Berastagi
                    dan Takengon yang dijaga dalam chiller.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => handleLineSwitch('abadi')}
                  className={`text-left p-4 rounded border transition-colors duration-150 cursor-pointer ${
                    line === 'abadi'
                      ? 'bg-[#F7F3EE] border-[#6D3B47]'
                      : 'bg-[#F7F3EE]/55 border-[#DCD3C9] hover:border-[#6E655F]'
                  }`}
                >
                  <p className="font-editorial text-xl font-semibold text-[#2B2625]">
                    Lini Abadi — Untuk Selamanya
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#6E655F]">
                    Bunga awetan dalam bingkai shadow-box kayu, pressed flower kaca,
                    atau blok resin bening yang tahan bertahun-tahun.
                  </p>
                </button>
              </div>
            </div>

            {/* Step 2: Choose Size */}
            <div className="pt-8 border-t border-[#DCD3C9]">
              <div className="flex items-baseline justify-between gap-4 mb-4">
                <h3 className="font-editorial text-2xl font-semibold text-[#2B2625]">
                  2. Pilih skala dan ukuran
                </h3>
                <span className="text-xs text-[#6E655F]">
                  {line === 'segar' ? 'Jumlah tangkai' : 'Dimensi bingkai / resin'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {BUILDER_SIZES.map((size) => {
                  const isSelected = size.id === sizeId;
                  return (
                    <button
                      key={size.id}
                      type="button"
                      onClick={() => setSizeId(size.id)}
                      className={`text-left p-4 rounded border transition-colors duration-150 cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#F7F3EE] border-[#6D3B47]'
                          : 'bg-[#F7F3EE]/55 border-[#DCD3C9] hover:border-[#6E655F]'
                      }`}
                    >
                      <div>
                        <span className="font-editorial text-xl font-semibold text-[#2B2625]">
                          {size.name}
                        </span>
                        <p className="text-xs font-medium text-[#7A8B74] mt-0.5">
                          {line === 'segar' ? size.segarLabel : size.abadiLabel}
                        </p>
                        <p className="mt-2 text-xs leading-relaxed text-[#6E655F]">
                          {size.note}
                        </p>
                      </div>
                      <p
                        className={`mt-4 pt-3 border-t border-[#DCD3C9] text-sm font-semibold tabular-nums ${
                          isSelected ? 'text-[#6D3B47]' : 'text-[#2B2625]'
                        }`}
                      >
                        {formatRupiah(size.price)}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Highland Flower Varieties (1-3) */}
            <div className="pt-8 border-t border-[#DCD3C9]">
              <div className="flex items-baseline justify-between gap-4 mb-4">
                <h3 className="font-editorial text-2xl font-semibold text-[#2B2625]">
                  3. Pilih varietas bunga dataran tinggi
                </h3>
                <span className="text-xs text-[#6E655F] tabular-nums">
                  Terpilih {selectedFlowerIds.length} dari maks. 3 jenis
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {BUILDER_FLOWERS.map((flower) => {
                  const isSelected = selectedFlowerIds.includes(flower.id);
                  return (
                    <button
                      key={flower.id}
                      type="button"
                      onClick={() => toggleFlower(flower.id)}
                      aria-pressed={isSelected}
                      className={`text-left p-4 rounded border transition-colors duration-150 cursor-pointer flex items-start justify-between gap-3 ${
                        isSelected
                          ? 'bg-[#F7F3EE] border-[#6D3B47]'
                          : 'bg-[#F7F3EE]/50 border-[#DCD3C9] hover:border-[#6E655F]'
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <span
                          aria-hidden="true"
                          className="w-4 h-4 rounded-full border border-[#2B2625]/20 shrink-0 mt-1"
                          style={{ backgroundColor: flower.petalColor }}
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[#2B2625] leading-snug">
                            {flower.name}
                          </p>
                          <p className="text-xs text-[#6E655F] mt-0.5">
                            {flower.origin} · {flower.toneLabel}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-xs font-semibold text-[#2B2625] tabular-nums whitespace-nowrap">
                          +{formatRupiah(flower.price)}
                        </p>
                        {isSelected && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#6D3B47] mt-1">
                            <Check className="w-3 h-3 stroke-[2]" aria-hidden="true" />
                            Dipilih
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Wrap or Preservation Frame */}
            <div className="pt-8 border-t border-[#DCD3C9]">
              <div className="flex items-baseline justify-between gap-4 mb-4">
                <h3 className="font-editorial text-2xl font-semibold text-[#2B2625]">
                  4. {line === 'segar' ? 'Pilih balutan atau vas' : 'Pilih media pengawetan'}
                </h3>
                <span className="text-xs text-[#6E655F]">
                  Termasuk label krim Abadikala
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {availableFinishes.map((finish) => {
                  const isSelected = finish.id === activeFinish.id;
                  return (
                    <button
                      key={finish.id}
                      type="button"
                      onClick={() => setFinishId(finish.id)}
                      className={`text-left p-4 rounded border transition-colors duration-150 cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#F7F3EE] border-[#6D3B47]'
                          : 'bg-[#F7F3EE]/50 border-[#DCD3C9] hover:border-[#6E655F]'
                      }`}
                    >
                      <div>
                        <p className="text-sm font-medium text-[#2B2625] leading-snug">
                          {finish.name}
                        </p>
                        <p className="text-xs text-[#6E655F] mt-1.5 leading-relaxed">
                          {finish.note}
                        </p>
                      </div>
                      <p className="mt-3 pt-2.5 border-t border-[#DCD3C9] text-xs font-semibold text-[#2B2625] tabular-nums">
                        {finish.price === 0 ? 'Termasuk' : `+${formatRupiah(finish.price)}`}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Optional Circular Upgrade: Segar -> Abadi Preservation Reservation */}
              {line === 'segar' && (
                <label className="mt-4 flex items-start gap-3 p-4 rounded border border-[#DCD3C9] bg-[#F7F3EE]/75 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includePreservationVoucher}
                    onChange={(e) => setIncludePreservationVoucher(e.target.checked)}
                    className="mt-0.5 accent-[#6D3B47] w-4 h-4 shrink-0 cursor-pointer"
                  />
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-[#2B2625]">
                        Tambahkan Reservasi Preservasi “Dari Segar Menjadi Abadi”
                      </p>
                      <p className="text-xs text-[#6E655F] mt-0.5 leading-relaxed">
                        Kunci slot pengeringan silika untuk mengubah buket segar ini
                        menjadi bingkai pressed flower setelah acara usai (antar kembali
                        ke studio maksimal H+2).
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-[#6D3B47] tabular-nums whitespace-nowrap">
                      +{formatRupiah(PRESERVATION_BOOKING_FEE)}
                    </span>
                  </div>
                </label>
              )}
            </div>

            {/* Step 5: Personal Card & Lhokseumawe Delivery Slot */}
            <div className="pt-8 border-t border-[#DCD3C9]">
              <h3 className="font-editorial text-2xl font-semibold text-[#2B2625] mb-1">
                5. Kartu ucapan dan sesi pengantaran
              </h3>
              <p className="text-xs text-[#6E655F] mb-5">
                Ditulis tangan di atas kartu katun krem khas Abadikala (300gsm).
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="card-to"
                    className="block text-xs font-medium text-[#2B2625] mb-1.5"
                  >
                    Untuk (Opsional)
                  </label>
                  <input
                    id="card-to"
                    type="text"
                    value={cardTo}
                    onChange={(e) => setCardTo(e.target.value)}
                    placeholder="Misal: Cut Nadia"
                    maxLength={48}
                    className="w-full px-3.5 py-2.5 text-sm bg-[#F7F3EE] border border-[#DCD3C9] rounded text-[#2B2625] placeholder:text-[#6E655F]/70 focus:border-[#6D3B47] focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="card-from"
                    className="block text-xs font-medium text-[#2B2625] mb-1.5"
                  >
                    Dari (Opsional)
                  </label>
                  <input
                    id="card-from"
                    type="text"
                    value={cardFrom}
                    onChange={(e) => setCardFrom(e.target.value)}
                    placeholder="Misal: Teuku Farhan"
                    maxLength={48}
                    className="w-full px-3.5 py-2.5 text-sm bg-[#F7F3EE] border border-[#DCD3C9] rounded text-[#2B2625] placeholder:text-[#6E655F]/70 focus:border-[#6D3B47] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="card-message"
                    className="block text-xs font-medium text-[#2B2625] mb-1.5"
                  >
                    Pesan di kartu ucapan
                  </label>
                  <textarea
                    id="card-message"
                    rows={3}
                    value={cardMessage}
                    onChange={(e) => setCardMessage(e.target.value)}
                    placeholder="Selamat menempuh hari baru, semoga momen ini selalu hangat dikenang."
                    maxLength={180}
                    className="w-full px-3.5 py-2.5 text-sm bg-[#F7F3EE] border border-[#DCD3C9] rounded text-[#2B2625] placeholder:text-[#6E655F]/70 focus:border-[#6D3B47] focus:outline-none resize-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <span className="block text-xs font-medium text-[#2B2625] mb-2">
                    Sesi pengantaran atau ambil di studio Lhokseumawe
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {DELIVERY_SLOTS.map((slot) => {
                      const isSelected = slot === deliverySlot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setDeliverySlot(slot)}
                          className={`px-3.5 py-2 text-xs font-medium rounded border transition-colors cursor-pointer whitespace-nowrap ${
                            isSelected
                              ? 'bg-[#2B2625] text-[#F7F3EE] border-[#2B2625]'
                              : 'bg-[#F7F3EE] text-[#2B2625] border-[#DCD3C9] hover:border-[#6D3B47]'
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Sticky Live Preview & Price Calculation */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="bg-[#F7F3EE] border border-[#DCD3C9] rounded p-6 sm:p-7">
              <div className="flex items-baseline justify-between gap-4 pb-4 border-b border-[#DCD3C9]">
                <h3 className="font-editorial text-2xl font-semibold text-[#2B2625]">
                  Pratinjau Rancangan
                </h3>
                <span className="text-xs text-[#6E655F] whitespace-nowrap">
                  {line === 'segar' ? 'Lini Segar' : 'Lini Abadi'} · {activeSize.name}
                </span>
              </div>

              {/* Dynamic SVG Composition */}
              <div className="py-5">
                <BouquetPreviewSvg
                  line={line}
                  size={activeSize}
                  flowers={activeFlowers}
                  finish={activeFinish}
                />
              </div>

              {/* Live Abadikala Cream Cotton Greeting Card Preview */}
              <div className="border border-[#DCD3C9] bg-[#EFE9E0]/65 p-4 rounded">
                <div className="flex items-center justify-between text-[11px] text-[#6E655F] mb-2">
                  <span>Kartu Katun Abadikala 300gsm</span>
                  <span className="font-editorial font-semibold tracking-wider text-[#2B2625]">
                    ABADIKALA
                  </span>
                </div>
                <p className="font-editorial text-base italic text-[#2B2625]">
                  {cardTo.trim() ? `Untuk ${cardTo.trim()},` : 'Untuk penerima istimewa,'}
                </p>
                <p className="mt-1.5 font-editorial text-base leading-relaxed text-[#2B2625]">
                  {cardMessage.trim()
                    ? `"${cardMessage.trim()}"`
                    : '"Tulis pesan singkat Anda untuk melihat pratinjau kartu ucapan studio."'}
                </p>
                <p className="mt-2.5 text-right font-editorial text-sm text-[#6E655F]">
                  — {cardFrom.trim() || 'Pengirim'}
                </p>
              </div>

              {/* Real-Time Rupiah Breakdown */}
              <dl className="mt-6 pt-5 border-t border-[#DCD3C9] space-y-2.5 text-sm">
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-[#6E655F]">
                    Skala {activeSize.name} (
                    {line === 'segar' ? activeSize.segarLabel : activeSize.abadiLabel})
                  </dt>
                  <dd className="text-[#2B2625] tabular-nums whitespace-nowrap">
                    {formatRupiah(activeSize.price)}
                  </dd>
                </div>

                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-[#6E655F]">
                    Bunga ({activeFlowers.map((f) => f.name).join(', ')})
                  </dt>
                  <dd className="text-[#2B2625] tabular-nums whitespace-nowrap">
                    {formatRupiah(flowersSubtotal)}
                  </dd>
                </div>

                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-[#6E655F]">{activeFinish.name}</dt>
                  <dd className="text-[#2B2625] tabular-nums whitespace-nowrap">
                    {activeFinish.price === 0
                      ? 'Termasuk'
                      : formatRupiah(activeFinish.price)}
                  </dd>
                </div>

                {preservationFee > 0 && (
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-[#6E655F]">
                      Reservasi Preservasi Lini Abadi
                    </dt>
                    <dd className="text-[#2B2625] tabular-nums whitespace-nowrap">
                      {formatRupiah(preservationFee)}
                    </dd>
                  </div>
                )}

                <div className="pt-4 mt-3 border-t border-[#DCD3C9] flex items-baseline justify-between gap-4">
                  <dt className="font-editorial text-xl font-semibold text-[#2B2625]">
                    Estimasi Total
                  </dt>
                  <dd className="text-xl font-semibold text-[#6D3B47] tabular-nums whitespace-nowrap">
                    {formatRupiah(totalPrice)}
                  </dd>
                </div>
              </dl>

              <button
                type="button"
                onClick={handleCommitCustomOrder}
                className={`mt-6 w-full py-3.5 px-5 rounded text-sm font-medium transition-colors duration-150 cursor-pointer flex items-center justify-center gap-2 ${
                  addedFeedback
                    ? 'bg-[#7A8B74] text-[#F7F3EE]'
                    : 'bg-[#6D3B47] text-[#F7F3EE] hover:bg-[#572D37]'
                }`}
              >
                {addedFeedback ? (
                  <>
                    <Check className="w-4 h-4 stroke-[1.75]" aria-hidden="true" />
                    <span>Masuk ke Ringkasan Pesanan</span>
                  </>
                ) : (
                  <span>Masukkan ke Ringkasan Pesanan</span>
                )}
              </button>

              <p className="mt-3 text-xs text-[#6E655F] text-center">
                Sesi pilihan: {deliverySlot}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
