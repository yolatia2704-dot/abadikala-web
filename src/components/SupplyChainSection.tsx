import { SUPPLY_PILLARS, SUPPLY_STUDIO_IMAGE } from '../data/catalog';
import { ResilientImage } from './ResilientImage';

export function SupplyChainSection() {
  return (
    <section
      id="pasokan"
      className="bg-[#EFE9E0] border-b border-[#DCD3C9] py-16 sm:py-24"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column (5 cols): Editorial Lead & Highland Studio Photography */}
          <div className="lg:col-span-5 flex flex-col">
            <p className="text-xs text-[#6E655F] tracking-wide mb-2.5">
              Pasokan & Keunggulan · Rantai Dingin & Sirkular
            </p>
            <h2
              className="font-editorial text-3xl sm:text-4xl font-semibold text-[#2B2625] leading-[1.12]"
              style={{ textWrap: 'balance' }}
            >
              Mengapa Abadikala Berbeda
            </h2>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#6E655F]">
              Menjaga kesegaran bunga potong di kota pesisir tropis seperti
              Lhokseumawe membutuhkan disiplin rantai dingin sekaligus cara kerja yang
              bertanggung jawab agar tidak ada setangkai pun berakhir terbuang.
            </p>

            <figure className="mt-8 border border-[#DCD3C9] bg-[#F7F3EE] rounded overflow-hidden">
              <div className="aspect-[4/3] w-full overflow-hidden bg-[#F7F3EE]">
                <ResilientImage
                  src={SUPPLY_STUDIO_IMAGE.src}
                  alt={SUPPLY_STUDIO_IMAGE.alt}
                  fallbackTitle="Stok Bunga Dataran Tinggi Abadikala"
                  className="w-full h-full object-cover"
                />
              </div>
              <figcaption className="px-4 py-3 border-t border-[#DCD3C9] flex items-center justify-between gap-4 text-xs text-[#6E655F]">
                <span>{SUPPLY_STUDIO_IMAGE.caption}</span>
              </figcaption>
            </figure>

            {/* Grounded Supply Origin Ledger (No fake metrics, pure factual origins) */}
            <dl className="mt-6 pt-5 border-t border-[#DCD3C9] grid grid-cols-2 gap-4 text-xs">
              <div>
                <dt className="text-[#6E655F]">Sentra Pasokan Utama</dt>
                <dd className="mt-1 font-medium text-[#2B2625]">
                  Berastagi & Takengon
                </dd>
              </div>
              <div>
                <dt className="text-[#6E655F]">Standar Varietas Dingin</dt>
                <dd className="mt-1 font-medium text-[#2B2625]">
                  Lembang & Batu
                </dd>
              </div>
            </dl>
          </div>

          {/* Right Column (7 cols): Asymmetric Editorial Pillars Separated by Hairlines */}
          <div className="lg:col-span-7 border-t border-[#DCD3C9] divide-y divide-[#DCD3C9]">
            {SUPPLY_PILLARS.map((pillar) => (
              <article
                key={pillar.number}
                className="py-7 sm:py-8 grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-6 items-start"
              >
                <div className="sm:col-span-2">
                  <span className="font-editorial text-3xl font-semibold text-[#6D3B47] tabular-nums">
                    {pillar.number}.
                  </span>
                </div>
                <div className="sm:col-span-10">
                  <h3 className="font-editorial text-2xl sm:text-[26px] font-semibold text-[#2B2625] leading-snug">
                    {pillar.title}
                  </h3>
                  <p className="mt-3 text-sm sm:text-[15px] leading-[1.7] text-[#6E655F]">
                    {pillar.summary}
                  </p>
                  <p className="mt-3.5 text-xs font-medium text-[#7A8B74]">
                    {pillar.detail}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
