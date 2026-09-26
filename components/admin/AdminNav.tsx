"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/admin/actions";
import { ADMIN_LINKS } from "./admin-links";

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function ExternalIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
    </svg>
  );
}

export default function AdminNav() {
  const pathname = usePathname();
  const current = ADMIN_LINKS.find((l) => pathname.startsWith(l.href));

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-2">
          <Link href="/admin" className="text-[15px] font-semibold text-navy lg:hidden">
            Valenca<span className="text-orange">.</span>
          </Link>
          <nav
            aria-label="Breadcrumb"
            className="hidden min-w-0 items-center gap-1.5 text-sm lg:flex"
          >
            <Link href="/admin" className="text-ink transition hover:text-navy">
              Admin
            </Link>
            <ChevronRight className="size-3.5 shrink-0 text-muted" />
            <span className="truncate font-medium text-navy">
              {current?.label ?? "Dashboard"}
            </span>
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-[10px] border border-line bg-white px-3 py-1.5 text-[13px] font-medium text-ink transition hover:bg-tint"
          >
            <ExternalIcon className="size-3.5" />
            Lihat situs
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-[10px] border border-line bg-white px-3 py-1.5 text-[13px] font-medium text-ink transition hover:border-red-200 hover:bg-red-50 hover:text-[#b3261e]"
            >
              Keluar
            </button>
          </form>
        </div>
      </div>

      <nav
        className="flex gap-1 overflow-x-auto border-t border-line px-3 py-1.5 lg:hidden"
        aria-label="Menu admin"
      >
        {ADMIN_LINKS.map((l) => {
          const active = pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              aria-current={active ? "page" : undefined}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-[13px] transition ${
                active
                  ? "bg-tint font-medium text-navy"
                  : "text-ink hover:text-navy"
              }`}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
