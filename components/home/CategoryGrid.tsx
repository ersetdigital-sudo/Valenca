import Link from "next/link";
import Container from "@/components/Container";
import SectionHead from "@/components/home/SectionHead";
import Reveal from "@/components/Reveal";
import { Icon } from "@/components/icons";
import { products } from "@/data/products";

const cardTints = ["bg-[#E8EDF6]", "bg-[#FFE8DC]", "bg-[#EEF2F8]", "bg-[#FFEFE6]"];

export default function CategoryGrid() {
  return (
    <section id="layanan" className="relative z-10 py-20">
      <Container>
        <SectionHead
          center
          title="Mau Bayar Apa Hari Ini?"
          desc="Pilih layanan yang kamu butuhkan. Prosesnya cepat, biaya admin transparan, tanpa biaya tersembunyi."
        />
        <div className="grid gap-[18px] min-[501px]:grid-cols-2 min-[901px]:grid-cols-4">
          {products.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 0.06}>
              <Link
                href={`/bayar/${p.id}`}
                className="relative block overflow-hidden rounded-card border-2 border-navy bg-white px-5 py-[26px] text-center shadow-hard transition duration-200 hover:-translate-y-1 hover:shadow-[0_6px_0_#14213d]"
              >
                <span
                  className={`absolute inset-0 opacity-45 ${cardTints[i % 4]}`}
                />
                <span className="relative z-10 mx-auto mb-[14px] grid size-16 place-items-center rounded-full border-2 border-navy bg-orange shadow-[0_3px_0_#14213d]">
                  <Icon name={p.icon} className="size-7 text-white" />
                </span>
                <h3 className="relative z-10 mb-1 text-[15px] font-bold">
                  {p.nama}
                </h3>
                <span className="relative z-10 text-xs text-muted">{p.tag}</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
