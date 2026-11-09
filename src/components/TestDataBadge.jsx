export function TestDataBadge({ className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-gold px-2.5 py-1 text-[15px] font-medium text-gold-foreground ${className}`}
    >
      Test data
    </span>
  );
}