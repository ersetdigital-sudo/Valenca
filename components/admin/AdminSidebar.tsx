"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_LINKS } from "./admin-links";

function BoxIcon({ className }: { className?: string }) {
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
      <path d="M21 8v8l-9 5-9-5V8l9-5 9 5Z" />
      <path d="m3 8 9 5 9-5" />
      <path d="M12 13v8" />
    </svg>
  );
}

function SettingsIcon({ className }: { className?: string }) {
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
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    </svg>
  );
}

function ReceiptIcon({ className }: { className?: string }) {
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
      <path d="M4 3v18l2.5-1.5L9 21l2.5-1.5L14 21l2.5-1.5L19 21V3l-2.5 1.5L14 3l-2.5 1.5L9 3 6.5 4.5 4 3Z" />
      <path d="M8 8h8M8 12h8M8 16h5" />
    </svg>
  );
}

function navIcon(href: string, className?: string) {
  if (href === "/admin/produk") return <BoxIcon className={className} />;
  if (href === "/admin/pesanan") return <ReceiptIcon className={className} />;
  return <SettingsIcon className={className} />;
}

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-line bg-white lg:flex">
      <div className="flex h-16 shrink-0 items-center border-b border-line px-5">
        <Link href="/admin" className="text-[15px] font-semibold text-navy">
          Valenca<span className="text-orange">.</span>{" "}
          <span className="font-normal text-ink">Admin</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-3" aria-label="Menu admin">
        {ADMIN_LINKS.map((l) => {
          const active = pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-2.5 rounded-[10px] px-3 py-2 text-sm transition ${
                active
                  ? "bg-tint font-medium text-navy"
                  : "text-ink hover:bg-tint/60 hover:text-navy"
              }`}
            >
              {navIcon(l.href, "size-[18px] shrink-0 opacity-80")}
              {l.label}
            </Link>
          );
        })}
      </nav>

      <div className="shrink-0 border-t border-line p-3">
        <div className="flex items-center gap-3 rounded-xl bg-tint/70 px-3 py-2.5">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-navy text-[13px] font-semibold text-white">
            A
          </span>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-medium text-navy">Admin</p>
            <p className="truncate text-xs text-ink">Valenca PPOB</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
