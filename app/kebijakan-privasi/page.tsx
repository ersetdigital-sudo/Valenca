import type { Metadata } from "next";
import LegalDocument from "@/components/legal/LegalDocument";
import { kebijakanPrivasi } from "@/data/legal";

export const metadata: Metadata = {
  title: kebijakanPrivasi.title,
  description: kebijakanPrivasi.description,
  alternates: { canonical: "/kebijakan-privasi" },
};

export default function KebijakanPrivasiPage() {
  return (
    <LegalDocument
      doc={kebijakanPrivasi}
      extraLink={{ href: "/syarat-ketentuan", label: "Syarat & Ketentuan" }}
    />
  );
}
