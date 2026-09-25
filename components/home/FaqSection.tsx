"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Container from "@/components/Container";
import SectionHead from "@/components/home/SectionHead";
import type { Faq } from "@/types";

export default function FaqSection({ items }: { items: Faq[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="relative z-10 py-20">
      <Container>
        <SectionHead
          center
          title="Pertanyaan Umum"
          desc="Jawaban untuk pertanyaan yang sering ditanyakan."
        />
        <div className="overflow-hidden rounded-card border-2 border-navy bg-white">
          {items.map((f, i) => (
            <div key={f.q} className="border-b-2 border-line last:border-b-0">
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-[15px] font-bold transition hover:bg-tint"
              >
                <span>{f.q}</span>
                <i
                  className={`font-display text-xl not-italic text-navy transition-transform duration-200 ${
                    open === i ? "rotate-45" : ""
                  }`}
                >
                  +
                </i>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <p className="max-w-[72ch] px-6 pb-5 text-sm text-muted">
                      {f.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
