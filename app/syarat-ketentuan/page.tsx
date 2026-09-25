import type { Metadata } from "next";
import LegalDocument from "@/components/legal/LegalDocument";
import { syaratKetentuan } from "@/data/legal";

export const metadata: Metadata = {
  title: syaratKetentuan.title,
  description: syaratKetentuan.description,
  alternates: { canonical: "/syarat-ketentuan" },
};

export default function SyaratKetentuanPage() {
  return (
    <LegalDocument
      doc={syaratKetentuan}
      extraLink={{ href: "/kebijakan-privasi", label: "Kebijakan Privasi" }}
    />
  );
}
