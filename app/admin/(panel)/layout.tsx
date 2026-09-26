import type { Metadata } from "next";
import AdminNav from "@/components/admin/AdminNav";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { requireAdmin } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "Admin | Valenca",
  robots: { index: false, follow: false },
};

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  return (
    <div className="min-h-dvh bg-bg">
      <AdminSidebar />
      <div className="lg:pl-64">
        <AdminNav />
        <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
