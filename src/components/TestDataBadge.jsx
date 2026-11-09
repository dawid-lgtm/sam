export function TestDataBadge({ className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#7a6114] ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-gold" />
      Test data
    </span>
  );
}