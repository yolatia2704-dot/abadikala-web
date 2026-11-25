import { MessageCircle } from 'lucide-react';

interface NavbarProps {
  totalItems: number;
  onOpenDrawer: () => void;
}

export function Navbar({ totalItems, onOpenDrawer }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-[#F7F3EE]/95 backdrop-blur-xs border-b border-[#DCD3C9]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 h-16 flex items-center justify-between gap-6 lg:gap-8">
        <a
          href="#konsep"
          className="inline-flex items-baseline gap-2.5 whitespace-nowrap shrink-0 group"
        >
          <span className="font-editorial text-2xl font-bold tracking-[0.06em] text-[#2B2625] group-hover:text-[#6D3B47] transition-colors">
            ABADIKALA
          </span>
          <span className="hidden sm:inline text-[11px] font-medium tracking-[0.12em] text-[#6E655F]">
            LHOKSEUMAWE • ACEH
          </span>
        </a>

        <nav
          aria-label="Navigasi utama"
          className="hidden lg:flex items-center gap-7 text-sm text-[#6E655F]"
        >
          <a
            href="#konsep"
            className="hover:text-[#2B2625] underline-offset-4 hover:underline decoration-[#DCD3C9] transition-colors whitespace-nowrap shrink-0"
          >
            Konsep
          </a>
          <a
            href="#pasokan"
            className="hover:text-[#2B2625] underline-offset-4 hover:underline decoration-[#DCD3C9] transition-colors whitespace-nowrap shrink-0"
          >
            Pasokan & Keunggulan
          </a>
          <a
            href="#katalog"
            className="hover:text-[#2B2625] underline-offset-4 hover:underline decoration-[#DCD3C9] transition-colors whitespace-nowrap shrink-0"
          >
            Katalog
          </a>
          <a
            href="#virtual-flower-bar"
            className="hover:text-[#2B2625] underline-offset-4 hover:underline decoration-[#DCD3C9] transition-colors whitespace-nowrap shrink-0"
          >
            Virtual Flower Bar
          </a>
        </nav>

        <button
          type="button"
          onClick={onOpenDrawer}
          className="inline-flex items-center gap-2 rounded-full border border-[#6D3B47] px-4 py-2 text-xs sm:text-sm font-medium text-[#6D3B47] hover:bg-[#6D3B47] hover:text-[#F7F3EE] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <MessageCircle className="w-3.5 h-3.5 stroke-[1.5]" aria-hidden="true" />
          <span className="tabular-nums">
            {totalItems > 0
              ? `Pesan via WhatsApp (${totalItems})`
              : 'Pesan via WhatsApp'}
          </span>
        </button>
      </div>
    </header>
  );
}
