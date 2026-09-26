import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CheckTransaction from "@/components/cek-transaksi/CheckTransaction";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cek Transaksi",
  description:
    "Cek status pembayaran pesanan Valenca dengan kode transaksi VLC-. Menampilkan status verifikasi QRIS, detail layanan, dan total bayar secara instan.",
  alternates: { canonical: "/cek-transaksi" },
};

export default function CekTransaksiPage() {
  return (
    <>
      <Header variant="home" />
      <main>
        <CheckTransaction />
      </main>
      <Footer variant="home" />
    </>
  );
}
