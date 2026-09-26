export function rupiah(n: number): string {
  return `Rp${n.toLocaleString("id-ID")}`;
}

export function formatWaktu(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const date = d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  });
  const time = d
    .toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Jakarta",
    })
    .replace(/\./g, ":");
  return `${date}, ${time} WIB`;
}
