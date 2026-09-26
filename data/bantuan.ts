export type HelpCategoryId =
  | "transaksi"
  | "pulsa"
  | "pln"
  | "tagihan"
  | "refund"
  | "akun";

export type HelpCategoryIcon =
  | "receipt"
  | "phone"
  | "zap"
  | "file"
  | "refund"
  | "shield";

export type HelpCategory = {
  id: HelpCategoryId;
  title: string;
  desc: string;
  icon: HelpCategoryIcon;
};

export type HelpArticle = {
  q: string;
  a: string;
  cat: HelpCategoryId;
  keywords: string[];
};

export const helpCategories: HelpCategory[] = [
  {
    id: "transaksi",
    title: "Transaksi & Pembayaran",
    desc: "Status proses, kode transaksi, dan bukti pembayaran.",
    icon: "receipt",
  },
  {
    id: "pulsa",
    title: "Pulsa & Paket Data",
    desc: "Isi ulang pulsa atau paket data yang belum masuk.",
    icon: "phone",
  },
  {
    id: "pln",
    title: "Token PLN",
    desc: "Token listrik prabayar yang belum diterima.",
    icon: "zap",
  },
  {
    id: "tagihan",
    title: "Tagihan & Pembayaran",
    desc: "PDAM, BPJS, internet, e-money, dan multifinance.",
    icon: "file",
  },
  {
    id: "refund",
    title: "Refund & Pengembalian Dana",
    desc: "Pengembalian dana untuk transaksi yang gagal.",
    icon: "refund",
  },
  {
    id: "akun",
    title: "Akun & Keamanan",
    desc: "Transaksi tanpa akun dan keamanan data pribadi.",
    icon: "shield",
  },
];

export const helpArticles: HelpArticle[] = [
  {
    q: "Berapa lama transaksi diproses setelah pembayaran?",
    a: "Rata-rata produk masuk dalam 28 detik setelah pembayaran terkonfirmasi. Jika ada gangguan dari biller, proses bisa memakan waktu hingga 1x24 jam. Pantau statusnya kapan saja lewat halaman Cek Transaksi.",
    cat: "transaksi",
    keywords: ["proses", "lama", "cepat", "detik", "24 jam", "menunggu"],
  },
  {
    q: "Pulsa atau paket data saya belum masuk, bagaimana?",
    a: "Tunggu beberapa menit lalu cek status di halaman Cek Transaksi memakai kode transaksi Anda. Jika statusnya gagal, dana otomatis dikembalikan penuh. Jika masih diproses melewati 1x24 jam, hubungi Customer Care dengan menyertakan kode transaksi.",
    cat: "pulsa",
    keywords: ["pulsa", "paket data", "internet", "belum masuk", "kuota"],
  },
  {
    q: "Token PLN belum saya terima setelah bayar?",
    a: "Token listrik biasanya langsung terkirim dalam hitungan detik ke nomor HP yang Anda isi, dan 20 digit tokennya juga tampil di struk digital. Buka halaman Cek Transaksi untuk melihatnya kembali. Jika lewat 1x24 jam belum diterima, hubungi Customer Care.",
    cat: "pln",
    keywords: ["token", "pln", "listrik", "prabayar", "nomor meter"],
  },
  {
    q: "Saldo terpotong tapi transaksi masih diproses, perlu bayar ulang?",
    a: "Tidak perlu bayar ulang. Tunggu hingga maksimal 1x24 jam dan pantau status di halaman Cek Transaksi dengan kode transaksi Anda. Jika transaksi gagal, dana akan dikembalikan penuh secara otomatis. Simpan kode transaksi tersebut untuk pengajuan bantuan.",
    cat: "transaksi",
    keywords: ["saldo", "terpotong", "pending", "dobel", "bayar ulang"],
  },
  {
    q: "Transaksi gagal, apakah uang saya kembali?",
    a: "Ya. Dana dikembalikan penuh ke sumber pembayaran Anda (QRIS/e-wallet) tanpa potongan. Proses pengembalian mengikuti kebijakan bank atau e-wallet masing-masing, biasanya 1-3 hari kerja. Simpan kode transaksi Anda; jika lewat 3 hari kerja dana belum masuk, hubungi Customer Care.",
    cat: "refund",
    keywords: ["refund", "gagal", "kembali", "uang", "pengembalian", "dana"],
  },
  {
    q: "Bagaimana cara melihat riwayat transaksi saya?",
    a: "Valenca berjalan tanpa akun, jadi riwayat dilacak lewat kode transaksi berformat VLC-XXXX yang muncul setelah pembayaran. Simpan kode tersebut, lalu buka halaman Cek Transaksi dan masukkan kode untuk melihat status, detail, dan struk kapan saja.",
    cat: "transaksi",
    keywords: ["riwayat", "histori", "kode transaksi", "vlc", "cek"],
  },
  {
    q: "Di mana saya bisa mendapatkan bukti transaksi?",
    a: "Masukkan kode transaksi di halaman Cek Transaksi, lalu struk digital akan tampil bersama status transaksinya. Anda bisa mengunduhnya sebagai PDF lewat tombol Unduh Struk atau mencetaknya langsung dari browser.",
    cat: "transaksi",
    keywords: ["struk", "bukti", "bon", "pdf", "cetak", "download"],
  },
  {
    q: "Bagaimana cara mengajukan pengaduan atau komplain?",
    a: "Siapkan kode transaksi dan bukti bayar, lalu klik tombol Ajukan Pengaduan di halaman ini atau hubungi Customer Care via WhatsApp. Sertakan kode transaksi dan keluhan Anda agar tim kami bisa mengecek dan membantu secepatnya. Customer Care online 24 jam setiap hari.",
    cat: "transaksi",
    keywords: ["pengaduan", "komplain", "keluhan", "cs", "customer care"],
  },
];
