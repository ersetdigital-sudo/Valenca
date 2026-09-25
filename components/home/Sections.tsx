import Container from "@/components/Container";
import SectionHead from "@/components/home/SectionHead";
import Reveal from "@/components/Reveal";
import { whyItems, steps, promo } from "@/data/home";

export function WhySection() {
  return (
    <section id="kenapa" className="relative z-10 bg-white py-20">
      <Container>
        <SectionHead
          center
          title="Kenapa Pilih Valenca?"
          desc="Kami membangun layanan yang kamu bisa andalkan setiap hari."
        />
        <div className="grid gap-5 min-[501px]:grid-cols-2 min-[901px]:grid-cols-4">
          {whyItems.map((w) => (
            <div
              key={w.title}
              className="rounded-card border-2 border-line bg-white px-[22px] py-7 text-center transition hover:border-navy"
            >
              <div className="font-display text-[38px] leading-none text-orange">
                {w.value}
              </div>
              <h4 className="mb-[6px] mt-3 text-[15px] font-bold">{w.title}</h4>
              <p className="text-[13px] text-muted">{w.desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function StepsSection() {
  return (
    <section id="cara" className="relative z-10 py-20">
      <Container>
        <SectionHead
          center
          title="Cara Bayar di Valenca"
          desc="Cuma 4 langkah simpel, tidak perlu daftar akun."
        />
        <div className="grid gap-5 min-[501px]:grid-cols-2 min-[901px]:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.06}>
              <div className="relative rounded-card border-2 border-navy bg-white px-5 py-6 shadow-hard">
                <span className="absolute -top-[14px] left-5 grid size-[34px] place-items-center rounded-full border-2 border-navy bg-orange font-display text-base text-white">
                  {i + 1}
                </span>
                <h4 className="mb-[6px] text-[15px] font-bold">{s.title}</h4>
                <p className="text-[13px] text-muted">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function PromoBanner() {
  return (
    <section className="relative z-10 pb-20">
      <Container>
        <Reveal>
          <div className="flex flex-wrap items-center justify-between gap-[30px] rounded-card border-2 border-navy bg-navy px-9 py-11 text-white shadow-[0_6px_0_#14213d] max-[700px]:flex-col max-[700px]:text-center">
            <div>
              <h3 className="font-display text-[clamp(22px,4vw,32px)] leading-[1.2]">
                {promo.title}
              </h3>
              <p className="mt-2 max-w-[44ch] text-[15px] opacity-[0.94]">
                {promo.desc}
              </p>
            </div>
            <a
              href="/#layanan"
              className="inline-block rounded-btn border-2 border-navy bg-white px-7 py-[14px] text-sm font-bold text-navy shadow-hard transition duration-150 hover:-translate-y-0.5 hover:shadow-[0_4px_0_#14213d]"
            >
              {promo.cta}
            </a>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
