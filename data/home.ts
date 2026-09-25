import type { Faq, Testimonial, WhyItem, StepItem } from "@/types";

export const whyItems: WhyItem[] = [
  {
    value: "99.9%",
    title: "Uptime Sistem",
    desc: "Server redundan memastikan layanan tetap hidup kapan pun.",
  },
  {
    value: "28dtk",
    title: "Rata-rata Proses",
    desc: "Dari pembayaran terkonfirmasi hingga produk diterima.",
  },
  {
    value: "0",
    title: "Biaya Tersembunyi",
    desc: "Semua biaya admin ditampilkan sebelum kamu bayar.",
  },
  {
    value: "24/7",
    title: "Customer Support",
    desc: "Tim kami siap membantu kapan saja via WhatsApp.",
  },
];

export const steps: StepItem[] = [
  { title: "Pilih Layanan", desc: "Klik kategori produk yang ingin kamu bayar." },
  {
    title: "Isi Nomor Tujuan",
    desc: "Masukkan nomor HP, ID pelanggan, atau nomor meter.",
  },
  {
    title: "Bayar via QRIS",
    desc: "Scan QR code dari aplikasi bank atau e-wallet mana saja.",
  },
  {
    title: "Selesai!",
    desc: "Produk langsung masuk setelah pembayaran terkonfirmasi.",
  },
];

export const promo = {
  title: "🎉 Promo Spesial Bulan Ini!",
  desc: "Bayar tagihan PLN & BPJS, dapatkan cashback hingga Rp15.000 langsung ke e-wallet kamu. Berlaku s.d. akhir bulan.",
  cta: "Ambil Promo",
};

export const testimonials: Testimonial[] = [
  {
    initial: "R",
    name: "Raka Dwiputra",
    city: "Jakarta",
    quote:
      '"Gampang banget! Bayar token listrik jam 2 pagi tetap instan masuk. Nggak perlu ke minimarket lagi."',
  },
  {
    initial: "S",
    name: "Siti Nurhaliza",
    city: "Bandung",
    quote:
      '"Suka sama transparansinya. Biaya admin jelas dari awal, jadi nggak kaget pas bayar."',
  },
  {
    initial: "B",
    name: "Bagas Ardiansyah",
    city: "Surabaya",
    quote:
      '"CS-nya fast respon banget. Waktu ada kendala langsung dibantu dalam 5 menit."',
  },
];

export const faqs: Faq[] = [
  {
    q: "Apakah saya harus membuat akun?",
    a: "Tidak. Semua transaksi di Valenca berjalan sebagai guest checkout. Pilih layanan, isi nomor tujuan, bayar via QRIS, selesai.",
  },
  {
    q: "Pembayaran apa saja yang diterima?",
    a: "Saat ini kami menggunakan QRIS yang bisa dipindai dari semua aplikasi bank dan e-wallet di Indonesia (BCA, BRI, Mandiri, GoPay, OVO, DANA, dll).",
  },
  {
    q: "Berapa lama produk saya diterima?",
    a: "Rata-rata 28 detik setelah pembayaran terkonfirmasi. Jika ada gangguan dari biller, maksimal 1x24 jam.",
  },
  {
    q: "Bagaimana kalau nomor tujuan salah?",
    a: "Transaksi yang sudah berhasil tidak bisa dibatalkan. Pastikan cek ulang nomor di halaman ringkasan sebelum bayar.",
  },
  {
    q: "Apakah ada biaya admin?",
    a: "Ada, dan berbeda tiap kategori. Biaya admin selalu ditampilkan transparan sebelum kamu bayar.",
  },
  {
    q: "Sudah bayar tapi belum masuk?",
    a: "Simpan bukti bayar dan kode transaksi, lalu hubungi CS kami yang online 24 jam. Dana yang tidak terproses akan dikembalikan penuh.",
  },
];
