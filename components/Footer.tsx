import Link from "next/link";
import Container from "@/components/Container";
import { products } from "@/data/products";
import { site } from "@/data/site";

function Logo() {
  return (
    <div className="mb-4 flex items-center gap-2 font-display text-[26px] tracking-[-0.02em] text-white">
      <span className="inline-block size-3 rounded-full bg-orange" />
      Valenca
    </div>
  );
}

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h5 className="mb-4 text-xs font-normal uppercase tracking-[0.16em] text-orange">
      {children}
    </h5>
  );
}

const linkCls = "text-white/75 transition hover:text-white";

export default function Footer({ variant }: { variant: "home" | "legal" }) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-navy text-white">
      {variant === "home" && (
        <div className="pointer-events-none absolute -right-[100px] -top-[200px] size-[400px] rounded-full bg-orange opacity-[0.16] blur-[80px]" />
      )}
      <Container className={variant === "home" ? "pt-[60px] pb-7" : "pt-[52px] pb-[26px]"}>
        <div
          className={`relative z-10 grid gap-9 max-[520px]:grid-cols-1 ${
            variant === "home"
              ? "max-[860px]:grid-cols-2 min-[861px]:grid-cols-[1.6fr_1fr_1fr_1.2fr]"
              : "max-[700px]:grid-cols-1 min-[701px]:grid-cols-[1.6fr_1fr_1fr]"
          }`}
        >
          <div>
            <Logo />
            <p className="max-w-[32ch] text-sm text-white/70">
              Layanan pembayaran digital yang cepat, aman, dan transparan. Tanpa
              perlu buat akun.
            </p>
          </div>

          {variant === "home" ? (
            <>
              <div>
                <Heading>Layanan</Heading>
                <ul className="flex list-none flex-col gap-[10px] p-0">
                  {products.map((p) => (
                    <li key={p.id}>
                      <Link href={`/bayar/${p.id}`} className={linkCls}>
                        {p.nama}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <Heading>Perusahaan</Heading>
                <ul className="flex list-none flex-col gap-[10px] p-0">
                  <li>
                    <Link href="/#kenapa" className={linkCls}>
                      Tentang Kami
                    </Link>
                  </li>
                  <li>
                    <Link href="/#cara" className={linkCls}>
                      Cara Bayar
                    </Link>
                  </li>
                  <li>
                    <Link href="/#faq" className={linkCls}>
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link href="/syarat-ketentuan" className={linkCls}>
                      Syarat &amp; Ketentuan
                    </Link>
                  </li>
                  <li>
                    <Link href="/kebijakan-privasi" className={linkCls}>
                      Kebijakan Privasi
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <Heading>Kontak</Heading>
                <ul className="flex list-none flex-col gap-[10px] p-0 text-white/75">
                  <li>
                    WhatsApp:{" "}
                    <span className="font-semibold text-navy-light">
                      {site.whatsapp}
                    </span>
                  </li>
                  <li>Email: {site.email}</li>
                  <li>Jam Layanan: {site.jamLayanan}</li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <div>
                <Heading>Navigasi</Heading>
                <ul className="flex list-none flex-col gap-[10px] p-0">
                  <li>
                    <Link href="/" className={linkCls}>
                      Beranda
                    </Link>
                  </li>
                  <li>
                    <Link href="/#layanan" className={linkCls}>
                      Layanan
                    </Link>
                  </li>
                  <li>
                    <Link href="/#cara" className={linkCls}>
                      Cara Bayar
                    </Link>
                  </li>
                  <li>
                    <Link href="/#faq" className={linkCls}>
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <Heading>Legal &amp; Kontak</Heading>
                <ul className="flex list-none flex-col gap-[10px] p-0 text-white/75">
                  <li>
                    <Link href="/syarat-ketentuan" className={linkCls}>
                      Syarat &amp; Ketentuan
                    </Link>
                  </li>
                  <li>
                    <Link href="/kebijakan-privasi" className={linkCls}>
                      Kebijakan Privasi
                    </Link>
                  </li>
                  <li>WhatsApp: {site.whatsapp}</li>
                  <li>Email: {site.email}</li>
                </ul>
              </div>
            </>
          )}
        </div>

        <div
          className={`relative z-10 mt-11 flex flex-wrap justify-between gap-3 border-t border-white/15 pt-5 text-xs text-white/50 ${
            variant === "legal" ? "mt-10" : ""
          }`}
        >
          <span>
            © {year} Valenca. Seluruh hak cipta dilindungi.
          </span>
          <span>Pembayaran via QRIS — semua bank &amp; e-wallet.</span>
        </div>
      </Container>
    </footer>
  );
}
