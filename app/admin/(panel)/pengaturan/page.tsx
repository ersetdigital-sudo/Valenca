import type { Metadata } from "next";
import { getAllSettings } from "@/lib/data";
import { requireAdmin } from "@/lib/admin-auth";
import SettingsForm from "@/components/admin/SettingsForm";

export const metadata: Metadata = {
  title: "Pengaturan Situs | Admin Valenca",
  robots: { index: false, follow: false },
};

export default async function PengaturanPage() {
  await requireAdmin();
  const settings = await getAllSettings();
  return <SettingsForm initial={settings} />;
}
