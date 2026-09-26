export type IconName =
  | "pulsa"
  | "pln"
  | "data"
  | "pdam"
  | "bpjs"
  | "internet"
  | "emoney"
  | "finance"
  | "game"
  | "voucher"
  | "tv"
  | "pajak"
  | "asuransi"
  | "donasi"
  | "tiket"
  | "gas"
  | "belanja";

const iconPaths: Record<IconName, React.ReactNode> = {
  pulsa: (
    <>
      <path d="M7 2h10a1 1 0 011 1v18a1 1 0 01-1 1H7a1 1 0 01-1-1V3a1 1 0 011-1z" />
      <path d="M11 18h2" />
    </>
  ),
  pln: <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />,
  data: (
    <>
      <path d="M5 12.5a10 10 0 0114 0" />
      <path d="M2 9a14 14 0 0120 0" />
      <path d="M8.5 16a5 5 0 017 0" />
      <circle cx="12" cy="20" r="1" />
    </>
  ),
  pdam: <path d="M12 2.7s6 6.3 6 10.3a6 6 0 01-12 0c0-4 6-10.3 6-10.3z" />,
  bpjs: (
    <>
      <path d="M12 3L4 6v6c0 5 3.4 8.3 8 9 4.6-.7 8-4 8-9V6l-8-3z" />
      <path d="M12 9v6" />
      <path d="M9 12h6" />
    </>
  ),
  internet: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a15 15 0 010 18 15 15 0 010-18z" />
    </>
  ),
  emoney: (
    <>
      <rect x="2" y="5" width="20" height="14" rx="3" />
      <path d="M2 10h20" />
      <path d="M16 15h3" />
    </>
  ),
  finance: (
    <>
      <path d="M3 20h18" />
      <path d="M6 20V9" />
      <path d="M12 20V4" />
      <path d="M18 20v-7" />
    </>
  ),
  game: (
    <>
      <rect x="2" y="7" width="20" height="10" rx="5" />
      <path d="M7 10v4M5 12h4" />
      <path d="M16 11h.01" />
      <path d="M18 13.5h.01" />
    </>
  ),
  voucher: (
    <>
      <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
      <path d="M7 7h.01" />
    </>
  ),
  tv: (
    <>
      <rect x="2" y="4" width="20" height="14" rx="2" />
      <path d="M12 18v3M8 21h8" />
      <path d="m10 8.5 4.5 2.5-4.5 2.5z" />
    </>
  ),
  pajak: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8M8 17h5" />
    </>
  ),
  asuransi: (
    <>
      <path d="M2 13a10 10 0 0 1 20 0" />
      <path d="M12 3v16a2 2 0 0 0 4 0" />
    </>
  ),
  donasi: (
    <path d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z" />
  ),
  tiket: (
    <>
      <path d="M2 9a3 3 0 1 0 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 1 0 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
      <path d="M13 5v2M13 11v2M13 17v2" />
    </>
  ),
  gas: (
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  ),
  belanja: (
    <>
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </>
  ),
};

export const ICON_NAMES = Object.keys(iconPaths) as IconName[];

type IconProps = {
  name: IconName;
  className?: string;
};

export function Icon({ name, className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {iconPaths[name]}
    </svg>
  );
}

export function StarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M12 2l2.9 6 6.6.9-4.8 4.6 1.1 6.5L12 17l-5.8 3 1.1-6.5L2.5 8.9l6.6-.9z" />
    </svg>
  );
}

const misc: Record<string, React.ReactNode> = {
  shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  card: (
    <>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </>
  ),
  checkCircle: (
    <>
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
      <path d="M22 4L12 14.01l-3-3" />
    </>
  ),
  circleCheck: (
    <>
      <path d="M9 12l2 2 4-4" />
      <circle cx="12" cy="12" r="10" />
    </>
  ),
  bolt: <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />,
};

export function MiscIcon({
  name,
  className,
}: {
  name: keyof typeof misc;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      {misc[name]}
    </svg>
  );
}

export function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12 3a9 9 0 109 9"
        strokeWidth={2}
        stroke="currentColor"
        fill="none"
      />
    </svg>
  );
}

export function SuccessIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m4 12.5 5.2 5.2L20 7" />
    </svg>
  );
}
