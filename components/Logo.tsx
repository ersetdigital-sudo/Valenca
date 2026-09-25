export default function Logo({
  size = 30,
  tile = true,
}: {
  size?: number;
  /** false = mark tanpa kotak (untuk permukaan navy, biar gak nyatu sama bg) */
  tile?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
      className="shrink-0"
    >
      {tile && <rect width="64" height="64" rx="14" fill="#14213D" />}
      <path d="M11 15 L22.5 15 L32 37 L32 50 L26.5 50 Z" fill="#FFFFFF" />
      <path d="M32 37 L41.5 15 L53 15 L37.5 50 L32 50 Z" fill="#FF6B35" />
    </svg>
  );
}
