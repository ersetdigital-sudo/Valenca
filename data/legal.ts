import type { LegalDoc } from "@/types";

export const syaratKetentuan: LegalDoc = {
  title: "Syarat & Ketentuan",
  description:
    "Syarat dan Ketentuan penggunaan layanan PPOB Valenca: transaksi, pembayaran QRIS, biaya admin, pembatalan, dan tanggung jawab pengguna.",
  intro:
    "Dengan menggunakan layanan Valenca, kamu dianggap telah membaca, memahami, dan menyetujui seluruh ketentuan di halaman ini.",
  sections: [
    {
      id: "s1",
      num: "01",
      title: "Definisi",
      items: [
        "**Valenca** adalah penyedia layanan Payment Point Online Bank (PPOB) untuk pembelian dan pembayaran produk digital.",
        "**Pengguna** adalah setiap pihak yang mengakses situs dan/atau melakukan transaksi di Valenca.",
        "**Biller** adalah penyedia produk/jasa resmi (operator seluler, PLN, PDAM, BPJS, ISP, multifinance, dan sejenisnya).",
        "**Nomor Tujuan** adalah nomor HP, ID pelanggan, nomor meter, nomor kartu, atau nomor kontrak yang diisi Pengguna.",
      ],
    },
    {
      id: "s2",
      num: "02",
      title: "Ruang Lingkup Layanan",
      paragraphs: [
        "Valenca menyediakan layanan isi ulang dan pembayaran tagihan, meliputi antara lain: pulsa, paket data, token dan tagihan PLN, PDAM, BPJS Kesehatan, internet & TV berlangganan, e-money/e-wallet, serta angsuran multifinance.",
        "Ketersediaan produk mengikuti ketersediaan dari masing-masing Biller dan dapat berubah sewaktu-waktu tanpa pemberitahuan terlebih dahulu.",
      ],
    },
    {
      id: "s3",
      num: "03",
      title: "Penggunaan Tanpa Akun",
      paragraphs: [
        "Transaksi di Valenca berjalan sebagai **guest checkout** — Pengguna tidak perlu mendaftar atau membuat akun. Karena itu, bukti transaksi dan kode transaksi merupakan satu-satunya rujukan resmi atas transaksi yang dilakukan.",
      ],
      note: "Simpan kode transaksi (format **VLC-XXXXXXXX**) dan bukti pembayaran kamu. Keduanya dibutuhkan saat mengajukan keluhan atau penelusuran transaksi.",
    },
    {
      id: "s4",
      num: "04",
      title: "Harga & Biaya Admin",
      items: [
        "Seluruh harga produk dan biaya admin ditampilkan secara transparan pada halaman ringkasan sebelum Pengguna melakukan pembayaran.",
        "Besaran biaya admin berbeda-beda per kategori layanan dan mengikuti ketentuan Biller.",
        "Harga dapat berubah sewaktu-waktu mengikuti kebijakan Biller. Harga yang mengikat adalah harga yang tertera pada saat transaksi dibuat.",
      ],
    },
    {
      id: "s5",
      num: "05",
      title: "Pembayaran via QRIS",
      paragraphs: [
        "Pembayaran dilakukan melalui kode QRIS yang dapat dipindai menggunakan aplikasi bank maupun e-wallet apa pun di Indonesia. Kode QRIS memiliki **masa berlaku 10 (sepuluh) menit** sejak dibuat.",
      ],
      items: [
        "Nominal pembayaran terisi otomatis saat kode dipindai dan tidak boleh diubah.",
        "Jika masa berlaku habis, Pengguna perlu membuat transaksi baru.",
        "Pembayaran di luar kanal resmi Valenca berada di luar tanggung jawab kami.",
      ],
    },
    {
      id: "s6",
      num: "06",
      title: "Pemrosesan Transaksi",
      paragraphs: [
        "Produk diproses setelah pembayaran terkonfirmasi. Rata-rata waktu pemrosesan adalah **28 detik**. Dalam hal terjadi gangguan pada sistem Biller, pemrosesan dapat memakan waktu hingga maksimal **1x24 jam**.",
        "Status transaksi dapat dipantau pada halaman status yang muncul setelah pembayaran dikonfirmasi.",
      ],
    },
    {
      id: "s7",
      num: "07",
      title: "Pembatalan & Pengembalian Dana",
      items: [
        "Transaksi yang telah berhasil diproses **tidak dapat dibatalkan**.",
        "Transaksi yang gagal atau tidak terproses akan dikembalikan penuh ke sumber dana Pengguna, umumnya dalam 1–7 hari kerja mengikuti kebijakan bank atau penyedia e-wallet terkait.",
        "Kesalahan pengisian Nomor Tujuan oleh Pengguna bukan merupakan dasar pengembalian dana.",
      ],
    },
    {
      id: "s8",
      num: "08",
      title: "Tanggung Jawab Pengguna",
      items: [
        "Memastikan kebenaran Nomor Tujuan sebelum melakukan pembayaran.",
        "Memastikan nominal dan produk yang dipilih sudah sesuai kebutuhan.",
        "Menyimpan bukti pembayaran dan kode transaksi.",
        "Menggunakan sumber dana yang sah dan milik sendiri.",
      ],
    },
    {
      id: "s9",
      num: "09",
      title: "Larangan Penggunaan",
      paragraphs: [
        "Pengguna dilarang memanfaatkan layanan Valenca untuk tindakan melawan hukum, termasuk namun tidak terbatas pada pencucian uang, penipuan, perjudian, penggunaan sumber dana hasil kejahatan, serta upaya peretasan, otomatisasi massal, atau manipulasi sistem.",
        "Valenca berhak menolak, menunda, atau membatalkan transaksi yang terindikasi melanggar ketentuan ini dan melaporkannya kepada pihak berwenang.",
      ],
    },
    {
      id: "s10",
      num: "10",
      title: "Batasan Tanggung Jawab",
      paragraphs: [
        "Valenca bertanggung jawab sebatas nilai transaksi yang bersangkutan. Valenca tidak bertanggung jawab atas kerugian tidak langsung, kehilangan keuntungan, atau kerugian yang timbul akibat gangguan jaringan, gangguan sistem Biller, keadaan kahar (force majeure), maupun kelalaian Pengguna dalam mengisi data transaksi.",
      ],
    },
    {
      id: "s11",
      num: "11",
      title: "Perubahan Ketentuan",
      paragraphs: [
        "Valenca dapat memperbarui Syarat & Ketentuan ini sewaktu-waktu. Versi terbaru berlaku sejak dipublikasikan di halaman ini. Penggunaan layanan setelah pembaruan berarti Pengguna menyetujui ketentuan yang telah diperbarui.",
      ],
    },
    {
      id: "s12",
      num: "12",
      title: "Hukum yang Berlaku",
      paragraphs: [
        "Syarat & Ketentuan ini tunduk pada hukum Republik Indonesia. Setiap perselisihan akan diselesaikan terlebih dahulu secara musyawarah; apabila tidak tercapai kesepakatan, penyelesaian dilakukan melalui jalur hukum yang berlaku di Indonesia.",
      ],
    },
  ],
  cta: {
    title: "Masih ada yang mau ditanyakan?",
    desc: "Tim CS kami online 24 jam. Hubungi WhatsApp **0812-0000-0000** atau email **halo@valenca.id**.",
    href: "/#faq",
    label: "Lihat FAQ",
  },
};

export const kebijakanPrivasi: LegalDoc = {
  title: "Kebijakan Privasi",
  description:
    "Kebijakan Privasi Valenca: data apa yang kami kumpulkan, bagaimana digunakan, dibagikan, disimpan, dan hak kamu sebagai pengguna.",
  intro:
    "Kami hanya mengumpulkan data seperlunya untuk memproses transaksi kamu. Halaman ini menjelaskan data apa yang kami simpan, untuk apa, dan hak apa yang kamu miliki.",
  sections: [
    {
      id: "p1",
      num: "01",
      title: "Prinsip Kami",
      paragraphs: [
        "Valenca berjalan tanpa akun. Kami menganut prinsip **minimalisasi data**: hanya mengumpulkan informasi yang benar-benar dibutuhkan untuk memproses transaksi, dan tidak meminta data pribadi yang tidak relevan.",
      ],
    },
    {
      id: "p2",
      num: "02",
      title: "Data yang Dikumpulkan",
      items: [
        "**Data transaksi:** Nomor Tujuan (nomor HP, ID pelanggan, nomor meter, nomor kartu, atau nomor kontrak), jenis produk, nominal, biaya admin, dan kode transaksi.",
        "**Data pembayaran:** status pembayaran dan referensi pembayaran dari penyedia QRIS. Kami tidak menerima nomor kartu atau PIN kamu.",
        "**Data teknis:** alamat IP, jenis perangkat dan peramban, serta waktu akses — digunakan untuk keamanan dan pencegahan penyalahgunaan.",
        "**Data komunikasi:** isi percakapan saat kamu menghubungi layanan pelanggan kami.",
      ],
    },
    {
      id: "p3",
      num: "03",
      title: "Data yang TIDAK Kami Simpan",
      note: "Kami tidak pernah meminta atau menyimpan **PIN, password, OTP, CVV, maupun data kartu** kamu. Petugas Valenca tidak akan pernah meminta informasi tersebut melalui kanal apa pun. Abaikan dan laporkan siapa pun yang memintanya mengatasnamakan Valenca.",
    },
    {
      id: "p4",
      num: "04",
      title: "Tujuan Penggunaan Data",
      items: [
        "Memproses transaksi ke Biller terkait dan mengirimkan produk ke Nomor Tujuan.",
        "Menampilkan status transaksi dan menerbitkan bukti transaksi.",
        "Menangani keluhan, penelusuran transaksi, dan pengembalian dana.",
        "Mendeteksi dan mencegah penipuan serta penyalahgunaan layanan.",
        "Memenuhi kewajiban hukum dan permintaan resmi dari otoritas berwenang.",
      ],
    },
    {
      id: "p5",
      num: "05",
      title: "Berbagi Data dengan Pihak Ketiga",
      paragraphs: [
        "Kami membagikan data hanya seperlunya kepada: (a) **Biller** untuk memproses produk yang kamu beli; (b) **penyedia pembayaran QRIS** untuk memproses dan merekonsiliasi pembayaran; dan (c) **otoritas berwenang** apabila diwajibkan oleh peraturan perundang-undangan.",
        "Kami **tidak menjual** data pribadi kamu kepada pihak mana pun.",
      ],
    },
    {
      id: "p6",
      num: "06",
      title: "Penyimpanan & Retensi",
      paragraphs: [
        "Data transaksi disimpan selama diperlukan untuk keperluan pembukuan, audit, penyelesaian sengketa, dan kepatuhan hukum. Setelah masa tersebut berakhir, data akan dihapus atau dianonimkan.",
      ],
    },
    {
      id: "p7",
      num: "07",
      title: "Keamanan Data",
      items: [
        "Seluruh komunikasi situs dienkripsi menggunakan protokol HTTPS/TLS.",
        "Akses ke data transaksi dibatasi hanya untuk personel yang berkepentingan.",
        "Pemantauan aktivitas mencurigakan dilakukan secara berkala.",
      ],
      paragraphs: [
        "Meski demikian, tidak ada sistem yang sepenuhnya bebas risiko. Jaga kerahasiaan bukti transaksi dan perangkat kamu.",
      ],
    },
    {
      id: "p8",
      num: "08",
      title: "Cookie & Analitik",
      paragraphs: [
        "Situs ini dapat menggunakan cookie fungsional untuk menjaga jalannya sesi transaksi serta cookie analitik agregat untuk memahami penggunaan situs. Kamu dapat menonaktifkan cookie melalui pengaturan peramban, namun sebagian fitur mungkin tidak berfungsi optimal.",
      ],
    },
    {
      id: "p9",
      num: "09",
      title: "Hak Pengguna",
      items: [
        "Meminta informasi mengenai data transaksi yang kami simpan atas dirimu.",
        "Meminta koreksi data yang tidak akurat.",
        "Meminta penghapusan data, sepanjang tidak bertentangan dengan kewajiban hukum dan audit.",
        "Mengajukan keberatan atas pemrosesan data tertentu.",
      ],
      paragraphs: [
        "Permintaan dapat diajukan melalui kontak di bawah dengan menyertakan kode transaksi sebagai verifikasi.",
      ],
    },
    {
      id: "p10",
      num: "10",
      title: "Privasi Anak",
      paragraphs: [
        "Layanan ini ditujukan untuk pengguna berusia 17 tahun ke atas atau yang telah cakap hukum. Kami tidak dengan sengaja mengumpulkan data anak di bawah umur tanpa persetujuan orang tua atau wali.",
      ],
    },
    {
      id: "p11",
      num: "11",
      title: "Perubahan Kebijakan",
      paragraphs: [
        "Kebijakan Privasi ini dapat diperbarui sewaktu-waktu. Versi terbaru berlaku sejak dipublikasikan di halaman ini, dan tanggal pembaruan akan selalu dicantumkan di bagian atas.",
      ],
    },
    {
      id: "p12",
      num: "12",
      title: "Kontak",
      paragraphs: [
        "Pertanyaan terkait privasi dapat dikirim ke **halo@valenca.id** atau WhatsApp **0812-0000-0000**, aktif 24 jam setiap hari.",
      ],
    },
  ],
  cta: {
    title: "Baca juga ketentuan layanannya",
    desc: "Syarat & Ketentuan menjelaskan aturan transaksi, biaya admin, pembatalan, dan pengembalian dana.",
    href: "/syarat-ketentuan",
    label: "Buka Syarat & Ketentuan",
  },
};
