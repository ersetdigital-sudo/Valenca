"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Button from "@/components/Button";

const slides = [
  {
    src: "/banners/banner-utama.webp",
    height: 811,
    alt: "Valenca — semua pembayaran dalam satu tempat: pulsa, paket data, token listrik, PDAM, BPJS, dan lainnya",
  },
  {
    src: "/banners/banner-data.webp",
    height: 812,
    alt: "Beli paket data lebih murah — Telkomsel, XL, Indosat, Tri, Axis, dan Smartfren",
  },
  {
    src: "/banners/banner-pln.webp",
    height: 811,
    alt: "Bayar tagihan listrik dan beli token PLN lebih praktis",
  },
];

const stats = [
  { value: "1.4M+", label: "Transaksi Sukses" },
  { value: "4.9/5", label: "Rating Pengguna" },
  { value: "<30 dtk", label: "Proses Otomatis" },
];

export default function Hero() {
  const [index, setIndex] = useState(0);
  const paused = useRef(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const t = setInterval(() => {
      if (!paused.current) setIndex((i) => (i + 1) % slides.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const go = (i: number) => setIndex((i + slides.length) % slides.length);

  return (
    <section className="relative overflow-hidden bg-white pb-10 pt-8">
      <div className="absolute inset-0 bg-tint" />
      <div className="pointer-events-none absolute -right-[100px] -top-[180px] size-[420px] rounded-full bg-navy opacity-[0.14] blur-[60px]" />
      <div className="pointer-events-none absolute -bottom-[120px] -left-[80px] size-[320px] rounded-full bg-orange opacity-[0.12] blur-[50px]" />
      <div className="relative z-10 mx-auto w-full max-w-[1760px] px-4 sm:px-6">
        <h1 className="sr-only">
          Valenca — Bayar Cepat, Hidup Lebih Ringan.
        </h1>
        <div
          className="relative z-10"
          onMouseEnter={() => (paused.current = true)}
          onMouseLeave={() => (paused.current = false)}
        >
          <div className="relative">
            <div className="overflow-hidden rounded-card border-2 border-navy shadow-hard">
              <div
                className="flex w-full transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${index * 100}%)` }}
              >
                {slides.map((s, i) => (
                  <Image
                    key={s.src}
                    src={s.src}
                    alt={s.alt}
                    width={1938}
                    height={s.height}
                    priority={i === 0}
                    sizes="(min-width: 1760px) 1712px, calc(100vw - 48px)"
                    className="block h-auto w-full shrink-0"
                  />
                ))}
              </div>
            </div>

            <button
              type="button"
              aria-label="Banner sebelumnya"
              onClick={() => go(index - 1)}
              className="absolute left-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full border-2 border-navy bg-white text-navy shadow-hard transition hover:bg-orange hover:text-white max-[700px]:hidden"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Banner berikutnya"
              onClick={() => go(index + 1)}
              className="absolute right-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full border-2 border-navy bg-white text-navy shadow-hard transition hover:bg-orange hover:text-white max-[700px]:hidden"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div className="mt-4 flex items-center justify-center gap-[10px]">
            {slides.map((s, i) => (
              <button
                key={s.src}
                type="button"
                aria-label={`Tampilkan banner ${i + 1}`}
                aria-current={i === index}
                onClick={() => go(i)}
                className={`h-[10px] rounded-full border-2 border-navy transition-all duration-200 ${
                  i === index ? "w-7 bg-orange" : "w-[10px] bg-white hover:bg-orange/40"
                }`}
              />
            ))}
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-[14px]">
            <Button variant="solid" href="/#layanan">
              Pilih Layanan
            </Button>
            <Button variant="outline" href="/#cara">
              Lihat Cara Bayar
            </Button>
          </div>

          <div
            data-hero-stats
            className="mx-auto mt-7 grid max-w-[720px] grid-cols-3 gap-y-4 text-center"
          >
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`px-2 sm:px-6 ${i > 0 ? "sm:border-l-2 sm:border-line" : ""}`}
              >
                <div className="font-display text-[20px] leading-none text-navy sm:text-[26px]">
                  {s.value}
                </div>
                <div className="mt-1.5 text-[12px] leading-snug text-muted sm:text-[13px]">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
