import { ArrowDownRight, ArrowRight } from 'lucide-react';
import {
  HERO_LINES,
  type CatalogCategory,
  type ProductLineId,
} from '../data/catalog';
import { ResilientImage } from './ResilientImage';

interface HeroSectionProps {
  activeLine: ProductLineId;
  onLineChange: (line: ProductLineId) => void;
  onExploreLineCatalog: (category: CatalogCategory) => void;
}

export function HeroSection({
  activeLine,
  onLineChange,
  onExploreLineCatalog,
}: HeroSectionProps) {
  const current = HERO_LINES[activeLine];
  const segar = HERO_LINES.segar;
  const abadi = HERO_LINES.abadi;

  return (
    <section
      id="konsep"
      className="border-b border-[#DCD3C9] bg-[#F7F3EE]"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Left Column (60% / 7 cols): Editorial Copy & Interactive Dual-Line Switcher */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <p className="text-[11px] sm:text-xs font-medium tracking-[0.12em] text-[#6E655F] mb-5">
                TOKO BUNGA SEGAR &amp; BUNGA AWETAN — LHOKSEUMAWE, ACEH
              </p>

              <h1
                className="font-editorial text-[clamp(2.65rem,4.9vw,4.5rem)] font-semibold leading-[1.04] tracking-[-0.015em] text-[#2B2625] max-w-2xl"
                style={{ textWrap: 'balance' }}
              >
                Segar Hari Ini,{' '}
                <span className="italic font-medium text-[#6D3B47]">
                  Abadi Selamanya
                </span>
              </h1>

              <p className="mt-6 text-base sm:text-[17px] leading-[1.7] text-[#6E655F] max-w-xl">
                Satu Bunga, Dua Bentuk Produk. Dari bahasa Sanskerta{' '}
                <em className="text-[#2B2625] not-italic font-medium">&lsquo;Abadi&rsquo;</em>{' '}
                dan{' '}
                <em className="text-[#2B2625] not-italic font-medium">&lsquo;Kala&rsquo;</em>{' '}
                (waktu)—kami menghadirkan buket bunga segar untuk merayakan momen hari
                ini, serta mengabadikannya menjadi kenangan yang bertahan bertahun-tahun.
              </p>

              {/* Interactive Dual-Line Switcher */}
              <div className="mt-9 pt-7 border-t border-[#DCD3C9] max-w-2xl">
                <div
                  role="tablist"
                  aria-label="Pilih lini produk Abadikala"
                  className="inline-flex flex-col sm:flex-row p-1 bg-[#EFE9E0] border border-[#DCD3C9] rounded-full w-full sm:w-auto gap-1"
                >
                  {(Object.keys(HERO_LINES) as ProductLineId[]).map((lineId) => {
                    const line = HERO_LINES[lineId];
                    const isSelected = activeLine === lineId;
                    return (
                      <button
                        key={lineId}
                        type="button"
                        role="tab"
                        aria-selected={isSelected}
                        onClick={() => onLineChange(lineId)}
                        className={`px-5 py-2.5 text-xs sm:text-sm font-medium rounded-full transition-colors duration-150 whitespace-nowrap cursor-pointer text-center ${
                          isSelected
                            ? 'bg-[#6D3B47] text-[#F7F3EE]'
                            : 'text-[#2B2625] hover:bg-[#F7F3EE]/70'
                        }`}
                      >
                        {line.fullLabel}
                      </button>
                    );
                  })}
                </div>

                {/* Dynamic Featured Highlight Preview */}
                <div className="mt-6 pt-5 border-t border-[#DCD3C9]">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h2 className="font-editorial text-2xl font-semibold text-[#2B2625]">
                      {current.frameTitle}
                    </h2>
                    <span className="text-xs font-medium text-[#7A8B74]">
                      {activeLine === 'segar' ? 'Tahap 01 · Hari Ini' : 'Tahap 02 · Selamanya'}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-[#6E655F]">
                    {current.highlightNote}
                  </p>

                  <dl className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#DCD3C9]/80 text-xs">
                    <div>
                      <dt className="text-[#6E655F]">Asal &amp; Proses</dt>
                      <dd className="mt-1 text-sm text-[#2B2625] leading-snug">
                        {current.origin}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[#6E655F]">Ketahanan Rangkaian</dt>
                      <dd className="mt-1 text-sm text-[#2B2625] leading-snug">
                        {current.longevity}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>

            {/* Contextual Quick Actions */}
            <div className="mt-9 pt-6 border-t border-[#DCD3C9] flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={() => onExploreLineCatalog(current.targetCategory)}
                className="inline-flex items-center gap-2.5 bg-[#6D3B47] text-[#F7F3EE] px-6 py-3 rounded text-sm font-medium hover:bg-[#572D37] transition-colors duration-150 whitespace-nowrap cursor-pointer"
              >
                <span>{current.ctaLabel}</span>
                <ArrowRight className="w-4 h-4 stroke-[1.5]" aria-hidden="true" />
              </button>

              <a
                href="#virtual-flower-bar"
                className="inline-flex items-center gap-2 border border-[#DCD3C9] bg-[#EFE9E0]/70 text-[#2B2625] px-5 py-3 rounded text-sm font-medium hover:border-[#6D3B47] hover:text-[#6D3B47] transition-colors duration-150 whitespace-nowrap"
              >
                <span>Buka Virtual Flower Bar</span>
                <ArrowDownRight className="w-4 h-4 stroke-[1.5]" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Right Column (40% / 5 cols): Uncropped 4:5 Dual-Frame Showcase "Dari Segar Menjadi Abadi" */}
          <div className="lg:col-span-5 flex flex-col">
            <figure className="border border-[#DCD3C9] bg-[#EFE9E0] rounded overflow-hidden flex flex-col h-full">
              {/* Top Editorial Strip */}
              <div className="px-4 py-3 border-b border-[#DCD3C9] bg-[#F7F3EE] flex items-center justify-between gap-3">
                <span className="font-editorial text-base font-semibold text-[#2B2625]">
                  Dari Segar Menjadi Abadi
                </span>
                <span className="text-[11px] text-[#6E655F] whitespace-nowrap">
                  Klik bingkai untuk bandingkan
                </span>
              </div>

              {/* 4:5 Split Side-by-Side Comparison Frame */}
              <div className="relative aspect-[4/5] w-full grid grid-cols-2 divide-x divide-[#DCD3C9] bg-[#EFE9E0]">
                {/* Left Half: Fresh Korean Wrap Bouquet */}
                <button
                  type="button"
                  onClick={() => onLineChange('segar')}
                  aria-label="Pilih sorotan Lini Segar"
                  className="relative w-full h-full overflow-hidden text-left group cursor-pointer focus-visible:z-10"
                >
                  <ResilientImage
                    src={segar.image}
                    alt={segar.imageAlt}
                    fallbackTitle="Lini Segar — Buket Mawar"
                    className={`w-full h-full object-cover transition-opacity duration-200 ${
                      activeLine === 'segar'
                        ? 'opacity-100'
                        : 'opacity-70 group-hover:opacity-90'
                    }`}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#2B2625]/80 via-[#2B2625]/35 to-transparent px-3.5 py-3.5">
                    <p className="text-[11px] font-medium tracking-wide text-[#F7F3EE]/90">
                      01 · Lini Segar
                    </p>
                    <p className="font-editorial text-base font-medium text-[#F7F3EE] leading-tight mt-0.5">
                      Buket Korean Wrap
                    </p>
                  </div>
                </button>

                {/* Right Half: Wooden Shadow-Box Frame */}
                <button
                  type="button"
                  onClick={() => onLineChange('abadi')}
                  aria-label="Pilih sorotan Lini Abadi"
                  className="relative w-full h-full overflow-hidden text-left group cursor-pointer focus-visible:z-10"
                >
                  <ResilientImage
                    src={abadi.image}
                    alt={abadi.imageAlt}
                    fallbackTitle="Lini Abadi — Shadow-Box"
                    className={`w-full h-full object-cover transition-opacity duration-200 ${
                      activeLine === 'abadi'
                        ? 'opacity-100'
                        : 'opacity-70 group-hover:opacity-90'
                    }`}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#2B2625]/80 via-[#2B2625]/35 to-transparent px-3.5 py-3.5">
                    <p className="text-[11px] font-medium tracking-wide text-[#F7F3EE]/90">
                      02 · Lini Abadi
                    </p>
                    <p className="font-editorial text-base font-medium text-[#F7F3EE] leading-tight mt-0.5">
                      Shadow-Box Kayu 3D
                    </p>
                  </div>
                </button>
              </div>

              {/* Authentic Abadikala Cream Label Tag Footer */}
              <figcaption className="px-4 py-4 border-t border-[#DCD3C9] bg-[#F7F3EE] flex items-center justify-between gap-4">
                <div className="border border-[#DCD3C9] bg-[#EFE9E0]/75 px-3.5 py-2 rounded">
                  <p className="font-editorial text-sm font-bold tracking-[0.08em] text-[#2B2625]">
                    ABADIKALA
                  </p>
                  <p className="text-[11px] text-[#6E655F]">
                    Segar Hari Ini, Abadi Selamanya · Lhokseumawe
                  </p>
                </div>
                <div className="text-right text-xs text-[#6E655F] leading-snug">
                  <p className="font-medium text-[#2B2625]">Satu Buket, Dua Masa</p>
                  <p className="mt-0.5">5–7 hari → 3–5+ tahun</p>
                </div>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
