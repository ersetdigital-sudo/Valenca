import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import LoginForm from "@/components/admin/LoginForm";
import { isAdmin } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "Masuk Admin | Valenca",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin/produk");

  return (
    <main className="grid min-h-dvh place-items-center bg-bg px-4 py-10">
      <div className="w-full max-w-[420px]">
        <div className="rounded-2xl border border-line bg-white p-7 shadow-card sm:p-8">
          <Link href="/" className="text-[15px] font-semibold text-navy">
            Valenca<span className="text-orange">.</span>
          </Link>
          <h1 className="mt-5 text-[22px] font-semibold tracking-tight text-navy">
            Masuk panel admin
          </h1>
          <p className="mb-6 mt-1 text-sm text-ink">
            Kelola produk, harga, QRIS, dan banner situs.
          </p>
          <LoginForm />
        </div>
        <p className="mt-5 text-center text-xs text-ink">
          <a href="/" className="underline underline-offset-4 transition hover:text-navy">
            ← Kembali ke situs
          </a>
        </p>
      </div>
    </main>
  );
}
