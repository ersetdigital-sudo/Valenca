import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CheckTransaction from "@/components/cek-transaksi/CheckTransaction";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cek Transaksi",
  description:
    "Lacak status transaksi Valenca: cek pembayaran, proses pesanan, detail layanan, hingga struk digital. Masukkan nomor transaksi untuk melihatnya secara instan.",
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
