export function rupiah(n: number): string {
  return "Rp" + n.toLocaleString("id-ID");
}

export function shortLabel(label: string): string {
  return label
    .replace(/^Pulsa\s+/, "")
    .replace(/^Token\s+/, "")
    .replace(/^Top Up\s+/, "");
}
