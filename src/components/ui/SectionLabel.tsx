export function SectionLabel({
  children,
  className = '',
  dark = false,
}: {
  children: string;
  className?: string;
  dark?: boolean;
}) {
  return (
    <span
      className={`text-[11px] uppercase tracking-[0.25em] font-medium ${
        dark ? 'text-silver' : 'text-warm-grey'
      } ${className}`}
    >
      {children}
    </span>
  );
}

export default SectionLabel;
