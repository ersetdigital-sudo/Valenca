import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "valenca_admin";
const TTL_SECONDS = 7 * 24 * 60 * 60;

export function sessionCookieName(): string {
  return COOKIE_NAME;
}

function secret(): string {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s) throw new Error("ADMIN_SESSION_SECRET belum di-set di env.");
  return s;
}

function sign(exp: number): string {
  return createHmac("sha256", secret()).update(String(exp)).digest("hex");
}

export function createSessionToken(now = Date.now()): string {
  const exp = Math.floor(now / 1000) + TTL_SECONDS;
  return `${exp}.${sign(exp)}`;
}

export function verifySessionToken(token: string | null | undefined): boolean {
  if (!token) return false;
  const [expRaw, sig] = token.split(".");
  if (!expRaw || !sig) return false;
  const exp = Number(expRaw);
  if (!Number.isFinite(exp) || exp * 1000 <= Date.now()) return false;
  const expected = Buffer.from(sign(exp), "utf8");
  const actual = Buffer.from(sig, "utf8");
  if (expected.length !== actual.length) return false;
  return timingSafeEqual(expected, actual);
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(COOKIE_NAME)?.value);
}

export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/login");
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: TTL_SECONDS,
  };
}
