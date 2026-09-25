import Container from "@/components/Container";
import { MiscIcon } from "@/components/icons";

const trustItems = [
  { icon: "shield", label: "Transaksi Terenkripsi" },
  { icon: "card", label: "Pembayaran QRIS" },
  { icon: "clock", label: "Layanan 24/7" },
  { icon: "checkCircle", label: "150+ Biller Resmi" },
] as const;

export default function TrustBar() {
  return (
    <div className="relative z-10 overflow-hidden bg-navy py-[18px] text-white">
      <Container>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {trustItems.map((t) => (
            <div
              key={t.label}
              className="flex items-center gap-[10px] text-[13px] font-semibold"
            >
              <MiscIcon name={t.icon} className="size-[22px]" />
              {t.label}
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
