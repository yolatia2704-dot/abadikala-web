export type ProductLineId = 'segar' | 'abadi';

export interface HeroLineContent {
  id: ProductLineId;
  shortLabel: string;
  fullLabel: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  frameTitle: string;
  frameMeta: string;
  origin: string;
  longevity: string;
  highlightNote: string;
  ctaLabel: string;
  targetCategory: CatalogCategory;
}

export const HERO_LINES: Record<ProductLineId, HeroLineContent> = {
  segar: {
    id: 'segar',
    shortLabel: 'Lini Segar',
    fullLabel: 'Lini Segar (Bunga untuk Hari Ini)',
    subtitle: 'Bunga potong segar dataran tinggi Berastagi & Takengon',
    image: '/src/assets/images/abadikala_hero_segar_1795585856522.jpg',
    imageAlt:
      'Buket bunga mawar merah muda dan putih gading segar berbalut kertas linen Korea matte dengan pita marun dan label krim Abadikala',
    frameTitle: 'Lini Segar — Buket Mawar Korean Wrap',
    frameMeta: 'Mawar blush & putih gading · Eukaliptus perak · Label krim Abadikala',
    origin: 'Berastagi (Sumut) & Takengon (Aceh Tengah) via chiller 4–6°C',
    longevity: '5–7 hari kesegaran optimal di ruang sejuk',
    highlightNote:
      'Dipetik dari kebun beriklim dingin, langsung direhidrasi di studio Lhokseumawe, dan siap diubah menjadi koleksi Lini Abadi setelah acara usai.',
    ctaLabel: 'Lihat Katalog Lini Segar',
    targetCategory: 'Lini Segar',
  },
  abadi: {
    id: 'abadi',
    shortLabel: 'Lini Abadi',
    fullLabel: 'Lini Abadi (Bunga Awetan Bertahun-Tahun)',
    subtitle: 'Shadow-box 3D, pressed flower bingkai kaca & blok resin botani',
    image: '/src/assets/images/abadikala_hero_abadi_1795585855950.jpg',
    imageAlt:
      'Bingkai shadow-box kayu ek alami yang mengabadikan buket mawar merah muda, putih gading, dan daun eukaliptus kering di atas papan katun krem',
    frameTitle: 'Lini Abadi — Bingkai Shadow-Box Kenangan',
    frameMeta: 'Pengeringan silika 3D · Kayu alami · Tahan 3–5 tahun',
    origin: 'Diolah langsung di meja pengeringan studio Lhokseumawe (zero-waste)',
    longevity: '3–5+ tahun tanpa perlu disiram, terhindar dari lembap & sinar terik',
    highlightNote:
      'Mengabadikan buket momen penting Anda maupun bunga studio yang belum terjual menjadi karya bingkai kayu dan resin bening bernilai kenangan.',
    ctaLabel: 'Lihat Katalog Lini Abadi',
    targetCategory: 'Lini Abadi',
  },
};

export const SUPPLY_PILLARS = [
  {
    number: '01',
    title: 'Distribusi Bunga Segar Dataran Tinggi Dingin',
    summary:
      'Bunga potong dipasok langsung dari sentra bunga beriklim sejuk di Berastagi (Sumatera Utara) dan Takengon (Aceh Tengah), serta mengadopsi standar varietas unggulan dataran tinggi dingin seperti Lembang (Bandung) dan Batu (Malang)—disimpan dalam chiller pendingin khusus agar tetap segar sempurna saat tiba di Lhokseumawe.',
    detail: 'Rantai dingin 4–6°C · Rehidrasi nutrisi batang sebelum dirangkai',
  },
  {
    number: '02',
    title: 'Konsep Sirkular Tanpa Terbuang (Zero-Waste)',
    summary:
      'Bunga segar yang belum terjual tidak dibuang layu, melainkan langsung masuk ke ruang pengeringan terkontrol untuk diolah menjadi bunga kering, pressed flower dalam bingkai kaca, hingga blok dan pembatas buku resin botani.',
    detail: 'Pengeringan angin & silika · 0% limbah kelopak layak olah',
  },
  {
    number: '03',
    title: 'Dari Buket Hari Ini Menjadi Kenangan Bertahun-Tahun',
    summary:
      'Satu rangkaian tidak berhenti saat perayaan selesai. Pelanggan di Lhokseumawe dapat mengembalikan buket wisuda, lamaran, atau pernikahan dalam 48 jam untuk dipreservasi utuh ke dalam shadow-box kayu atau resin bening berlabel tanggal momen.',
    detail: 'Layanan preservasi pasca-acara · Label katun Abadikala personal',
  },
] as const;

export const SUPPLY_STUDIO_IMAGE = {
  src: '/src/assets/images/abadikala_fresh_chiller_bucket_1795585859943.jpg',
  alt: 'Bunga potong mawar marun, mawar merah muda, lisianthus putih, dan eukaliptus segar hasil panen dataran tinggi di ember keramik studio Abadikala',
  caption: 'Stok bunga potong pagi dari dataran tinggi dingin di ruang kerja Abadikala, Lhokseumawe.',
};

export type CatalogCategory =
  | 'Semua'
  | 'Lini Segar'
  | 'Lini Abadi'
  | 'Preservasi & Bingkai'
  | 'Resin & Suvenir';

export const CATALOG_CATEGORIES: CatalogCategory[] = [
  'Semua',
  'Lini Segar',
  'Lini Abadi',
  'Preservasi & Bingkai',
  'Resin & Suvenir',
];

export interface CatalogItem {
  id: string;
  name: string;
  line: ProductLineId;
  category: Exclude<CatalogCategory, 'Semua'>;
  useCase: string;
  price: number;
  description: string;
  dimensions: string;
  featured: boolean;
  bentoVariant?: 'wide' | 'tall' | 'medium';
  image?: string;
  imageAlt?: string;
}

export const CATALOG_ITEMS: CatalogItem[] = [
  {
    id: 'buket-korean-berastagi',
    name: 'Buket Korean Wrap Mawar Berastagi',
    line: 'segar',
    category: 'Lini Segar',
    useCase: 'Ulang Tahun · Wisuda · Apresiasi',
    price: 265000,
    description:
      'Mawar blush dan putih gading dataran tinggi Berastagi, waxflower, serta eukaliptus perak dalam balutan kertas matte Korea, pita satin marun, dan label katun Abadikala.',
    dimensions: '12–14 tangkai segar · Tinggi ±40 cm',
    featured: true,
    bentoVariant: 'wide',
    image: '/src/assets/images/abadikala_hero_segar_1795585856522.jpg',
    imageAlt:
      'Buket segar mawar merah muda dan putih gading dengan eukaliptus dalam balutan kertas Korea krem dan pita marun',
  },
  {
    id: 'shadow-box-abadi-3d',
    name: 'Shadow-Box Abadi 3D Kayu Alami',
    line: 'abadi',
    category: 'Preservasi & Bingkai',
    useCase: 'Kenangan Pernikahan · Lamaran · Anniversary',
    price: 485000,
    description:
      'Bingkai kayu kedalaman 4,5 cm dengan kaca pelindung yang mengabadikan buket mawar blush, putih gading, dan eukaliptus dalam bentuk tiga dimensi di atas papan katun krem.',
    dimensions: 'Bingkai 25 × 30 × 4,5 cm · Tahan 3–5+ tahun',
    featured: true,
    bentoVariant: 'tall',
    image: '/src/assets/images/abadikala_hero_abadi_1795585855950.jpg',
    imageAlt:
      'Bingkai shadow-box kayu alami yang mengabadikan buket mawar blush dan putih gading kering secara tiga dimensi',
  },
  {
    id: 'bingkai-pressed-flower',
    name: 'Bingkai Pressed Flower Botani',
    line: 'abadi',
    category: 'Lini Abadi',
    useCase: 'Dekorasi Dinding · Kado Rumah Baru',
    price: 320000,
    description:
      'Kelopak mawar, bunga kosmos gading, dan daun pakis yang ditekan rata secara manual lalu disusun simetris di atas kertas katun bertekstur dalam bingkai kayu tipis.',
    dimensions: 'Bingkai 21 × 30 cm (A4) · Kaca ganda bening',
    featured: true,
    bentoVariant: 'medium',
    image: '/src/assets/images/abadikala_pressed_frame_1795585858228.jpg',
    imageAlt:
      'Bingkai kayu tipis berisi pressed flower kelopak mawar merah muda, bunga kosmos krem, dan daun pakis hijau lembut di atas kertas katun',
  },
  {
    id: 'set-resin-botani',
    name: 'Set Blok & Pembatas Buku Resin Botani',
    line: 'abadi',
    category: 'Resin & Suvenir',
    useCase: 'Meja Kerja · Hadiah Wisuda · Kenangan',
    price: 210000,
    description:
      'Karya resin bening anti-menguning berisi kuncup mawar kering, baby’s breath, dan daun eukaliptus kecil—tersedia dalam set blok heksagonal dan pembatas buku berumbai katun.',
    dimensions: 'Blok 9 cm + Pembatas buku 14 cm · Pengerjaan 5–7 hari',
    featured: true,
    bentoVariant: 'medium',
    image: '/src/assets/images/abadikala_resin_keepsake_1795585858089.jpg',
    imageAlt:
      'Blok resin bening geometris dan pembatas buku resin berisi kuncup mawar merah muda dan bunga putih kering di atas batu travertine',
  },
  {
    id: 'buket-saku-takengon',
    name: 'Buket Saku Harian Takengon',
    line: 'segar',
    category: 'Lini Segar',
    useCase: 'Hadiah Spontan · Teman Dekat',
    price: 135000,
    description:
      'Lima tangkai mawar segar pilihan berpadu krisan putih Takengon dan dedaunan segar dalam lipatan kertas linen ringan untuk satu genggaman.',
    dimensions: '7 tangkai segar · Tinggi ±30 cm',
    featured: false,
  },
  {
    id: 'buket-marun-lembang',
    name: 'Buket Editorial Marun Dataran Tinggi',
    line: 'segar',
    category: 'Lini Segar',
    useCase: 'Perayaan Penting · Kado Orang Tua',
    price: 365000,
    description:
      'Perpaduan mawar merah marun pekat standar varietas Lembang, lisianthus putih, krisan kancing hijau, dan eukaliptus perak dalam gaya rangkai melebar.',
    dimensions: '18–20 tangkai segar · Tinggi ±45 cm',
    featured: false,
  },
  {
    id: 'jasa-preservasi-buket',
    name: 'Layanan Preservasi Buket Anda (Shadow-Box)',
    line: 'abadi',
    category: 'Preservasi & Bingkai',
    useCase: 'Titip Buket Akad · Wisuda · Lamaran',
    price: 425000,
    description:
      'Antarkan buket segar Anda ke studio Lhokseumawe maksimal 48 jam setelah acara untuk dikeringkan dengan teknik silika dan ditata ulang ke bingkai shadow-box kayu.',
    dimensions: 'Proses pengeringan & tata ulang 14–21 hari kerja',
    featured: false,
  },
  {
    id: 'kapsul-zero-waste',
    name: 'Mini Posy Kering & Kartu Katun Sirkular',
    line: 'abadi',
    category: 'Resin & Suvenir',
    useCase: 'Ucapan Terima Kasih · Souvenir Pengajian',
    price: 85000,
    description:
      'Ikatan bunga kering mungil dari program pengolahan zero-waste Abadikala, diikat tali rami dan dilengkapi kartu catatan kertas katun 300gsm.',
    dimensions: 'Panjang ±17 cm · Tersedia pemesanan jumlah acara',
    featured: false,
  },
];

export interface BuilderSize {
  id: 'petite' | 'klasik' | 'istimewa';
  name: string;
  segarLabel: string;
  abadiLabel: string;
  note: string;
  price: number;
  scale: number;
}

export const BUILDER_SIZES: BuilderSize[] = [
  {
    id: 'petite',
    name: 'Petite',
    segarLabel: '7–9 tangkai',
    abadiLabel: 'Ukuran 15 × 20 cm / Blok 9 cm',
    note: 'Proporsi ringkas dan tenang untuk meja kerja atau ucapan personal.',
    price: 140000,
    scale: 0.85,
  },
  {
    id: 'klasik',
    name: 'Klasik',
    segarLabel: '14–16 tangkai',
    abadiLabel: 'Bingkai 21 × 30 cm / Blok 13 cm',
    note: 'Ukuran seimbang paling diminati untuk hadiah ulang tahun dan wisuda.',
    price: 255000,
    scale: 1,
  },
  {
    id: 'istimewa',
    name: 'Istimewa',
    segarLabel: '22–26 tangkai',
    abadiLabel: 'Shadow-Box 30 × 40 cm',
    note: 'Skala penuh untuk perayaan akad, lamaran, atau pajangan dinding utama.',
    price: 395000,
    scale: 1.13,
  },
];

export interface BuilderFlower {
  id: string;
  name: string;
  origin: string;
  toneLabel: string;
  price: number;
  petalColor: string;
  centerColor: string;
  shape: 'rose' | 'chrysanthemum' | 'lisianthus' | 'hydrangea' | 'cotton' | 'babysbreath';
}

export const BUILDER_FLOWERS: BuilderFlower[] = [
  {
    id: 'mawar-blush',
    name: 'Mawar Blush Berastagi',
    origin: 'Berastagi, Sumut',
    toneLabel: 'Merah muda lembut',
    price: 55000,
    petalColor: '#E8C5C1',
    centerColor: '#C5938E',
    shape: 'rose',
  },
  {
    id: 'mawar-marun',
    name: 'Mawar Marun Dataran Tinggi',
    origin: 'Standar Lembang',
    toneLabel: 'Marun botani',
    price: 65000,
    petalColor: '#6D3B47',
    centerColor: '#48232C',
    shape: 'rose',
  },
  {
    id: 'mawar-gading',
    name: 'Mawar Putih Gading',
    origin: 'Berastagi, Sumut',
    toneLabel: 'Putih krem',
    price: 55000,
    petalColor: '#F6F0E6',
    centerColor: '#D6C7B2',
    shape: 'lisianthus',
  },
  {
    id: 'krisan-takengon',
    name: 'Krisan Krem Takengon',
    origin: 'Takengon, Aceh Tengah',
    toneLabel: 'Krem hangat',
    price: 40000,
    petalColor: '#EAE0D0',
    centerColor: '#BFA98A',
    shape: 'chrysanthemum',
  },
  {
    id: 'hydrangea-sage',
    name: 'Hydrangea Sage Batu',
    origin: 'Standar Batu, Malang',
    toneLabel: 'Hijau kelabu',
    price: 70000,
    petalColor: '#8EA087',
    centerColor: '#667860',
    shape: 'hydrangea',
  },
  {
    id: 'babys-breath',
    name: 'Baby’s Breath & Eukaliptus',
    origin: 'Dataran Tinggi',
    toneLabel: 'Putih & sage',
    price: 35000,
    petalColor: '#FAF7F1',
    centerColor: '#7A8B74',
    shape: 'babysbreath',
  },
];

export interface BuilderFinish {
  id:
    | 'korean-linen'
    | 'kain-blacu'
    | 'vas-stoneware'
    | 'shadow-box-kayu'
    | 'pressed-frame'
    | 'blok-resin';
  line: ProductLineId;
  name: string;
  note: string;
  price: number;
  fillColor: string;
  strokeColor: string;
}

export const BUILDER_FINISHES: BuilderFinish[] = [
  {
    id: 'korean-linen',
    line: 'segar',
    name: 'Korean Matte Linen Wrap',
    note: 'Kertas krem matte + pita marun & label Abadikala',
    price: 0,
    fillColor: '#E8DFD1',
    strokeColor: '#B9AA98',
  },
  {
    id: 'kain-blacu',
    line: 'segar',
    name: 'Balutan Kain Blacu Sirkular',
    note: 'Kain katun tenun ulang-pakai + tali rami',
    price: 25000,
    fillColor: '#DDD2C0',
    strokeColor: '#9F907E',
  },
  {
    id: 'vas-stoneware',
    line: 'segar',
    name: 'Vas Keramik Stoneware',
    note: 'Siap pajang di meja ruang tamu tanpa repot potong batang',
    price: 95000,
    fillColor: '#D6CCBE',
    strokeColor: '#8D8073',
  },
  {
    id: 'shadow-box-kayu',
    line: 'abadi',
    name: 'Bingkai Shadow-Box 3D Kayu Alami',
    note: 'Kedalaman 4,5 cm dengan papan katun krem & kaca depan',
    price: 115000,
    fillColor: '#EFE9E0',
    strokeColor: '#A6896B',
  },
  {
    id: 'pressed-frame',
    line: 'abadi',
    name: 'Bingkai Pressed Flower Kaca Ganda',
    note: 'Susunan bunga tekan rata bergaya herbarium minimalis',
    price: 75000,
    fillColor: '#F7F3EE',
    strokeColor: '#B59B7E',
  },
  {
    id: 'blok-resin',
    line: 'abadi',
    name: 'Blok Resin Bening Botani',
    note: 'Resin jernih anti-UV bentuk heksagonal / prisma meja',
    price: 85000,
    fillColor: '#F3EFE9',
    strokeColor: '#B8ADA1',
  },
];

export const DELIVERY_SLOTS = [
  'Pagi (09.00 – 12.00 WIB)',
  'Siang (13.00 – 16.00 WIB)',
  'Sore (16.30 – 19.30 WIB)',
  'Ambil di Studio Lhokseumawe',
] as const;

export type DeliverySlot = (typeof DELIVERY_SLOTS)[number];

export interface OrderItem {
  id: string;
  name: string;
  subtitle: string;
  unitPrice: number;
  quantity: number;
  isCustom?: boolean;
  customDetails?: {
    lineLabel: string;
    sizeName: string;
    flowers: string[];
    finishName: string;
    deliverySlot: string;
    cardTo: string;
    cardMessage: string;
    cardFrom: string;
    includePreservationVoucher?: boolean;
  };
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace('Rp', 'Rp ');
}

export const ABADIKALA_WHATSAPP_NUMBER = '6281167892410';

export interface CustomerOrderForm {
  customerName: string;
  deliveryArea: string;
  deliveryDate: string;
  extraNotes: string;
}

export function buildWhatsAppMessage(
  items: OrderItem[],
  form: CustomerOrderForm,
): string {
  const lines: string[] = [
    'Halo Studio Abadikala Lhokseumawe,',
    'Saya ingin memesan rangkaian bunga dengan rincian berikut:',
    '',
  ];

  if (items.length === 0) {
    lines.push(
      '- Belum ada item dipilih (ingin konsultasi stok bunga segar dataran tinggi atau preservasi hari ini)',
    );
  } else {
    items.forEach((item, index) => {
      lines.push(
        `${index + 1}. ${item.name} (${item.quantity}x) — ${formatRupiah(
          item.unitPrice * item.quantity,
        )}`,
      );
      if (item.isCustom && item.customDetails) {
        const d = item.customDetails;
        lines.push(`   • Lini Produk: ${d.lineLabel}`);
        lines.push(`   • Skala / Ukuran: ${d.sizeName}`);
        lines.push(`   • Bunga Pilihan: ${d.flowers.join(', ')}`);
        lines.push(`   • Balutan / Wadah: ${d.finishName}`);
        if (d.includePreservationVoucher) {
          lines.push('   • Tambahan: Reservasi Preservasi Lini Abadi Pasca-Acara');
        }
        lines.push(`   • Sesi Pengantaran: ${d.deliverySlot}`);
        if (d.cardMessage.trim()) {
          const toText = d.cardTo.trim() ? `Untuk ${d.cardTo.trim()}` : '';
          const fromText = d.cardFrom.trim() ? ` — dari ${d.cardFrom.trim()}` : '';
          lines.push(
            `   • Kartu Ucapan: "${d.cardMessage.trim()}"${
              toText || fromText ? ` (${toText}${fromText})` : ''
            }`,
          );
        }
      } else if (item.subtitle) {
        lines.push(`   • Keterangan: ${item.subtitle}`);
      }
    });

    const grandTotal = items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    );
    lines.push('');
    lines.push(`Estimasi Total Rangkaian: ${formatRupiah(grandTotal)}`);
    lines.push('(Ongkos kurir area Lhokseumawe dikonfirmasi sesuai lokasi antar)');
  }

  lines.push('');
  lines.push('Data Pengiriman / Pengambilan:');
  lines.push(`• Nama Pemesan: ${form.customerName.trim() || '-'}`);
  lines.push(
    `• Area / Alamat: ${form.deliveryArea.trim() || 'Kota Lhokseumawe, Aceh'}`,
  );
  lines.push(
    `• Tanggal: ${form.deliveryDate || 'Menyesuaikan jadwal terdekat'}`,
  );
  if (form.extraNotes.trim()) {
    lines.push(`• Catatan Tambahan: ${form.extraNotes.trim()}`);
  }
  lines.push('');
  lines.push(
    'Mohon konfirmasi ketersediaan stok chiller hari ini. Terima kasih, Abadikala.',
  );

  return lines.join('\n');
}

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${ABADIKALA_WHATSAPP_NUMBER}?text=${encodeURIComponent(
    message,
  )}`;
}
