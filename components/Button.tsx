import Link from "next/link";

const variants = {
  solid:
    "inline-block rounded-btn border-2 border-navy bg-navy px-6 py-3 text-sm font-bold text-white shadow-hard transition duration-150 hover:-translate-y-0.5 hover:shadow-[0_4px_0_#14213d] active:translate-y-0 active:shadow-none",
  outline:
    "inline-block rounded-btn border-2 border-navy bg-transparent px-6 py-3 text-sm font-bold text-navy transition hover:bg-navy hover:text-white",
  white:
    "inline-block rounded-btn border-2 border-navy bg-white px-7 py-[14px] text-sm font-bold text-navy shadow-hard transition duration-150 hover:-translate-y-0.5 hover:shadow-[0_4px_0_#14213d]",
};

type ButtonProps = {
  variant: keyof typeof variants;
  href?: string;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
};

export default function Button({
  variant,
  href,
  onClick,
  className = "",
  children,
  ariaLabel,
}: ButtonProps) {
  const cls = `${variants[variant]} ${className}`;
  if (href) {
    return (
      <Link href={href} onClick={onClick} className={cls} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls} aria-label={ariaLabel}>
      {children}
    </button>
  );
}
