"use client";

import Link from "next/link";
import { useState } from "react";
import Button from "@/components/Button";
import Logo from "@/components/Logo";

type LinkItem = { label: string; href: string };

const homeLinks: LinkItem[] = [
  { label: "Layanan", href: "/#layanan" },
  { label: "Keunggulan", href: "/#kenapa" },
  { label: "Cara Bayar", href: "/#cara" },
  { label: "FAQ", href: "/#faq" },
];

const legalLinks: LinkItem[] = [
  { label: "Layanan", href: "/#layanan" },
  { label: "Cara Bayar", href: "/#cara" },
  { label: "FAQ", href: "/#faq" },
];

export default function Header({
  variant,
  extraLink,
}: {
  variant: "home" | "legal";
  extraLink?: LinkItem;
}) {
  const [open, setOpen] = useState(false);
  const links = variant === "home" ? homeLinks : [...legalLinks, ...(extraLink ? [extraLink] : [])];

  return (
    <header className="sticky top-0 z-50 border-b-2 border-navy bg-white/92 backdrop-blur-[12px]">
      <div className="mx-auto flex h-[70px] w-full max-w-[1180px] items-center justify-between px-5">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-[26px] tracking-[-0.02em]"
        >
          <Logo size={30} />
          Valenca
        </Link>

        {variant === "home" ? (
          <>
            <nav
              className={`${open ? "flex" : "hidden"} absolute left-0 right-0 top-[70px] flex-col items-stretch border-b-2 border-navy bg-white px-5 pb-5 pt-[10px] min-[861px]:static min-[861px]:flex min-[861px]:flex-row min-[861px]:items-center min-[861px]:gap-7 min-[861px]:border-0 min-[861px]:bg-transparent min-[861px]:p-0`}
            >
              {links.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-line py-[14px] text-sm font-semibold text-ink transition hover:text-navy min-[861px]:border-0 min-[861px]:py-0"
                >
                  {l.label}
                </Link>
              ))}
              <Button
                variant="solid"
                href="/#layanan"
                onClick={() => setOpen(false)}
                className="mt-[10px] text-center min-[861px]:mt-0"
              >
                Mulai Bayar
              </Button>
            </nav>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="hidden text-2xl text-navy max-[860px]:block"
              aria-label="Menu"
            >
              ☰
            </button>
          </>
        ) : (
          <nav className="hidden items-center gap-[26px] min-[761px]:flex">
            {links.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-sm font-semibold text-ink transition hover:text-orange"
              >
                {l.label}
              </Link>
            ))}
            <Button variant="solid" href="/#layanan">
              Mulai Bayar
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
}
