export type IconName =
  | "pulsa"
  | "pln"
  | "data"
  | "pdam"
  | "bpjs"
  | "internet"
  | "emoney"
  | "finance";

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
};

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
