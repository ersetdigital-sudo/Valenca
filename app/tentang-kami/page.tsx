import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import Button from "@/components/Button";
import SectionHead from "@/components/home/SectionHead";
import { WhySection, StepsSection } from "@/components/home/Sections";
import Testimonials from "@/components/home/Testimonials";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "Kenali Valenca lebih dekat — misi kami membuat pembayaran sehari-hari jadi cepat, jelas, dan tanpa ribet. Tanpa akun, bayar via QRIS, Customer Care 24 jam.",
  alternates: { canonical: "/tentang-kami" },
};

export default function TentangKamiPage() {
  return (
    <>
      <Header variant="home" />
      <main>
        <section className="relative z-10 py-14 sm:py-20">
          <Container>
            <div className="max-w-[780px]">
              <p className="flex items-center gap-3 text-[12px] font-bold uppercase tracking-[0.18em] text-navy">
                <span aria-hidden className="h-[3px] w-8 bg-orange" />
                Tentang Valenca
              </p>
              <h1 className="mt-4 font-display text-[clamp(30px,5vw,46px)] leading-[1.1] text-navy">
                Bayar Cepat, Hidup Lebih Ringan.
              </h1>
              <p className="mt-4 max-w-[66ch] text-base leading-relaxed text-ink">
                Kenali Valenca lebih dekat — dari misi kami membuat pembayaran
                sehari-hari terasa ringan, hingga cara kami melayani setiap
                pengguna.
              </p>
            </div>
          </Container>
        </section>

        <WhySection />

        <section id="cerita" className="relative z-10 py-20">
          <Container>
            <SectionHead
              center
              title="Cerita di Balik Valenca"
              desc="Kami ingin setiap pembayaran terasa semudah mengirim pesan."
            />
            <div className="mx-auto max-w-[68ch] space-y-5 text-[15px] leading-relaxed text-ink">
              <p>
                Valenca adalah layanan pembayaran digital (PPOB) untuk
                kebutuhan sehari-hari: pulsa dan paket data, token PLN, tagihan
                PDAM dan BPJS, internet, e-money, hingga multifinance. Semuanya
                bisa dibayar dalam satu tempat, kapan saja.
              </p>
              <p>
                Kami percaya pembayaran yang baik itu cepat, jelas, dan tanpa
                halangan. Karena itu Valenca berjalan tanpa akun — cukup pilih
                layanan, isi nomor tujuan, lalu bayar lewat QRIS dari aplikasi
                bank atau e-wallet apa pun.
              </p>
              <p>
                Transparansi selalu kami utamakan: biaya admin ditampilkan
                sebelum Anda bayar, status transaksi bisa dipantau real-time lewat
                halaman Cek Transaksi, dan Customer Care kami siap membantu 24
                jam setiap hari kalau ada kendala.
              </p>
            </div>
          </Container>
        </section>

        <StepsSection />
        <Testimonials />

        <section className="relative z-10 pb-20">
          <Container>
            <div className="flex flex-wrap items-center justify-between gap-6 rounded-card border border-navy/20 bg-navy px-6 py-9 shadow-card max-[700px]:flex-col max-[700px]:text-center">
              <div>
                <h3 className="font-display text-[clamp(20px,3.4vw,28px)] leading-[1.2] text-white">
                  Punya Pertanyaan?
                </h3>
                <p className="mt-2 max-w-[46ch] text-[15px] leading-relaxed text-white/85">
                  Kunjungi pusat bantuan kami — atau bicara langsung dengan
                  Customer Care.
                </p>
              </div>
              <div className="max-[700px]:w-full">
                <Button variant="white" href="/bantuan" className="max-[700px]:block max-[700px]:text-center">
                  Buka Pusat Bantuan →
                </Button>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer variant="home" />
    </>
  );
}
