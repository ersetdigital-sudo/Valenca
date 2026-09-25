import Container from "@/components/Container";
import Button from "@/components/Button";
import Reveal from "@/components/Reveal";
import { MiscIcon } from "@/components/icons";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pb-[70px] pt-[60px]">
      <div className="absolute inset-0 bg-tint" />
      <div className="pointer-events-none absolute -right-[100px] -top-[180px] size-[420px] rounded-full bg-navy opacity-[0.14] blur-[60px]" />
      <div className="pointer-events-none absolute -bottom-[120px] -left-[80px] size-[320px] rounded-full bg-orange opacity-[0.12] blur-[50px]" />
      <Container>
        <div className="relative z-10 grid items-center gap-10 max-[900px]:grid-cols-1 max-[900px]:text-center min-[901px]:grid-cols-2">
          <Reveal>
            <h1 className="font-display text-[clamp(36px,6vw,62px)] leading-[1.08] tracking-[-0.02em]">
              Bayar <span className="text-orange">Cepat</span>,<br />
              Hidup Lebih <span className="text-orange">Ringan</span>.
            </h1>
            <p className="mt-5 max-w-[48ch] text-[17px] text-ink max-[900px]:mx-auto">
              Pulsa, token listrik, tagihan air, BPJS, internet, hingga angsuran
              — semua bisa dibayar dalam hitungan detik. Tanpa perlu buat akun,
              langsung bayar via QRIS.
            </p>
            <div className="mt-8 flex flex-wrap gap-[14px] max-[900px]:justify-center">
              <Button variant="solid" href="/#layanan">
                Pilih Layanan
              </Button>
              <Button variant="outline" href="/#cara">
                Lihat Cara Bayar
              </Button>
            </div>
          </Reveal>

          <Reveal
            delay={0.1}
            className="relative flex min-h-[340px] items-center justify-center max-[900px]:mt-[30px] max-[900px]:min-h-0"
          >
            <div className="flex size-[320px] flex-col items-center justify-center rounded-full border-4 border-navy bg-navy text-white shadow-[0_30px_60px_-20px_rgba(20,33,61,.45)] max-[900px]:size-[260px]">
              <b className="font-display text-[54px] leading-none max-[900px]:text-[42px]">
                1.4M+
              </b>
              <span className="mt-[6px] text-sm font-medium opacity-[0.92]">
                Transaksi Berhasil
              </span>
            </div>
            <div className="absolute left-[-10px] top-5 flex items-center gap-[10px] rounded-btn border-2 border-navy bg-white px-[18px] py-3 text-[13px] font-semibold text-ok shadow-hard max-[900px]:hidden">
              <MiscIcon name="circleCheck" className="size-[22px]" />
              100% Aman
            </div>
            <div className="absolute bottom-10 right-0 flex items-center gap-[10px] rounded-btn border-2 border-navy bg-white px-[18px] py-3 text-[13px] font-semibold text-orange shadow-hard max-[900px]:hidden">
              <MiscIcon name="bolt" className="size-[22px]" />
              Proses &lt; 30 dtk
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
