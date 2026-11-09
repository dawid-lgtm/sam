export function Section({ title, subtitle, action, children, className = "" }) {
  return (
    <section className={`rounded-2xl border border-border bg-white p-4 sm:p-5 ${className}`}>
      {(title || action) && (
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            {title ? <h2 className="text-[17px] font-semibold leading-snug text-navy">{title}</h2> : null}
            {subtitle ? <p className="mt-1 text-sm leading-snug text-muted-foreground">{subtitle}</p> : null}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function EmptyLine({ children }) {
  return <p className="rounded-xl bg-secondary/60 px-3 py-4 text-sm text-muted-foreground">{children}</p>;
}

export function Pill({ children, tone = "neutral" }) {
  const tones = {
    neutral: "bg-secondary text-muted-foreground",
    gold: "bg-gold/15 text-[#7a6114]",
    navy: "bg-navy text-white",
    green: "bg-emerald-100 text-emerald-800",
    amber: "bg-amber-100 text-amber-900",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}