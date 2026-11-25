import { useState } from 'react';
import { Check, Plus } from 'lucide-react';
import {
  CATALOG_CATEGORIES,
  CATALOG_ITEMS,
  formatRupiah,
  type CatalogCategory,
  type CatalogItem,
} from '../data/catalog';
import { ResilientImage } from './ResilientImage';

interface CatalogSectionProps {
  selectedCategory: CatalogCategory;
  onCategoryChange: (category: CatalogCategory) => void;
  onAddCatalogItem: (item: CatalogItem) => void;
  getItemQuantity: (id: string) => number;
}

export function CatalogSection({
  selectedCategory,
  onCategoryChange,
  onAddCatalogItem,
  getItemQuantity,
}: CatalogSectionProps) {
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  const filteredItems =
    selectedCategory === 'Semua'
      ? CATALOG_ITEMS
      : CATALOG_ITEMS.filter((item) => item.category === selectedCategory);

  const featuredItems = filteredItems.filter((item) => item.featured);
  const compactItems = filteredItems.filter((item) => !item.featured);

  const handleAdd = (item: CatalogItem) => {
    onAddCatalogItem(item);
    setRecentlyAddedId(item.id);
    window.setTimeout(() => {
      setRecentlyAddedId((prev) => (prev === item.id ? null : prev));
    }, 1400);
  };

  const renderAddButton = (item: CatalogItem, compact = false) => {
    const qty = getItemQuantity(item.id);
    const justAdded = recentlyAddedId === item.id;

    return (
      <button
        type="button"
        onClick={() => handleAdd(item)}
        className={`inline-flex items-center justify-center gap-1.5 rounded border transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
          compact
            ? 'px-3.5 py-2 text-xs font-medium'
            : 'px-4 py-2.5 text-xs sm:text-sm font-medium'
        } ${
          justAdded
            ? 'border-[#7A8B74] bg-[#7A8B74] text-[#F7F3EE]'
            : 'border-[#6D3B47] text-[#6D3B47] hover:bg-[#6D3B47] hover:text-[#F7F3EE]'
        }`}
      >
        {justAdded ? (
          <>
            <Check className="w-3.5 h-3.5 stroke-[1.75]" aria-hidden="true" />
            <span>Masuk Pesanan</span>
          </>
        ) : (
          <>
            <Plus className="w-3.5 h-3.5 stroke-[1.5]" aria-hidden="true" />
            <span className="tabular-nums">
              {qty > 0 ? `Tambah lagi (${qty})` : 'Tambah ke Pesanan'}
            </span>
          </>
        )}
      </button>
    );
  };

  return (
    <section id="katalog" className="bg-[#F7F3EE] py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        {/* Section Header + Category Filter Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#DCD3C9]">
          <div className="max-w-xl">
            <p className="text-xs text-[#6E655F] mb-2">
              Katalog Abadikala · Lini Segar &amp; Lini Abadi
            </p>
            <h2
              className="font-editorial text-3xl sm:text-4xl font-semibold text-[#2B2625] leading-tight"
              style={{ textWrap: 'balance' }}
            >
              Koleksi terkurasi untuk hari ini dan bertahun-tahun ke depan
            </h2>
          </div>

          <div
            role="tablist"
            aria-label="Filter kategori katalog Abadikala"
            className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1"
          >
            {CATALOG_CATEGORIES.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => onCategoryChange(category)}
                  className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded border transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#2B2625] text-[#F7F3EE] border-[#2B2625]'
                      : 'bg-transparent text-[#6E655F] border-transparent hover:border-[#DCD3C9] hover:text-[#2B2625]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Varied Asymmetric Bento Grid for Flagship Items */}
        {featuredItems.length > 0 && (
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {featuredItems.map((item, idx) => {
              const isAllView = selectedCategory === 'Semua';
              let colSpanClass = 'lg:col-span-6';

              if (isAllView) {
                if (idx === 0) colSpanClass = 'lg:col-span-7';
                else if (idx === 1) colSpanClass = 'lg:col-span-5';
                else if (idx === 2) colSpanClass = 'lg:col-span-5';
                else if (idx === 3) colSpanClass = 'lg:col-span-7';
              } else if (featuredItems.length === 1) {
                colSpanClass = 'lg:col-span-12';
              }

              const isHorizontalWide =
                (isAllView && (idx === 0 || idx === 3)) || featuredItems.length === 1;

              return (
                <article
                  key={item.id}
                  className={`${colSpanClass} border border-[#DCD3C9] bg-[#EFE9E0]/55 rounded overflow-hidden flex flex-col justify-between`}
                >
                  <div>
                    <div
                      className={`w-full overflow-hidden border-b border-[#DCD3C9] bg-[#EFE9E0] ${
                        item.bentoVariant === 'tall' && isAllView
                          ? 'aspect-[4/4.35]'
                          : isHorizontalWide
                            ? 'aspect-[16/10]'
                            : 'aspect-[4/3]'
                      }`}
                    >
                      {item.image && (
                        <ResilientImage
                          src={item.image}
                          alt={item.imageAlt ?? item.name}
                          fallbackTitle={item.name}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                        />
                      )}
                    </div>

                    <div className="p-6 sm:p-7">
                      <p className="text-xs text-[#6E655F]">
                        <span>{item.category}</span>
                        <span className="mx-1.5" aria-hidden="true">
                          ·
                        </span>
                        <span>{item.useCase}</span>
                      </p>

                      <div className="mt-2.5 flex items-baseline justify-between gap-4">
                        <h3 className="font-editorial text-2xl sm:text-[26px] font-semibold text-[#2B2625] leading-snug">
                          {item.name}
                        </h3>
                        <p className="text-base sm:text-lg font-semibold text-[#2B2625] tabular-nums whitespace-nowrap">
                          {formatRupiah(item.price)}
                        </p>
                      </div>

                      <p className="mt-3 text-sm leading-relaxed text-[#6E655F]">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 sm:px-7 pb-6 sm:pb-7 pt-4 border-t border-[#DCD3C9]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <p className="text-xs text-[#6E655F] leading-relaxed">
                      {item.dimensions}
                    </p>
                    {renderAddButton(item)}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Compact Horizontal List Rows for Everyday Editions & Preservation Service */}
        {compactItems.length > 0 && (
          <div className="mt-14 pt-10 border-t border-[#DCD3C9]">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-6">
              <h3 className="font-editorial text-2xl font-semibold text-[#2B2625]">
                Koleksi Harian &amp; Layanan Preservasi Studio
              </h3>
              <p className="text-xs text-[#6E655F]">
                Pilihan ringkas untuk pengiriman cepat Lhokseumawe maupun titip preservasi buket
              </p>
            </div>

            <div className="border-t border-[#DCD3C9] divide-y divide-[#DCD3C9]">
              {compactItems.map((item) => (
                <article
                  key={item.id}
                  className="py-5 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-start md:items-center hover:bg-[#EFE9E0]/45 transition-colors px-2 -mx-2 rounded"
                >
                  <div className="md:col-span-4">
                    <h4 className="font-editorial text-xl font-semibold text-[#2B2625] leading-snug">
                      {item.name}
                    </h4>
                    <p className="text-xs text-[#6E655F] mt-1">
                      {item.category} · {item.useCase}
                    </p>
                  </div>

                  <div className="md:col-span-5">
                    <p className="text-sm text-[#6E655F] leading-relaxed">
                      {item.description}
                    </p>
                    <p className="text-xs text-[#6E655F]/90 mt-1">{item.dimensions}</p>
                  </div>

                  <div className="md:col-span-3 flex items-center justify-between md:justify-end gap-4">
                    <span className="text-sm sm:text-base font-semibold text-[#2B2625] tabular-nums whitespace-nowrap">
                      {formatRupiah(item.price)}
                    </span>
                    {renderAddButton(item, true)}
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
