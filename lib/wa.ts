export function waLinkFrom(display?: string, fallback?: string): string {
  let digits = (display ?? "").replace(/\D/g, "");
  if (digits.startsWith("0")) digits = `62${digits.slice(1)}`;
  else if (digits.startsWith("8")) digits = `62${digits}`;
  if (digits.length < 8) return fallback ?? "";
  return `https://wa.me/${digits}`;
}
