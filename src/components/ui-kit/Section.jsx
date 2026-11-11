export function Section({ title, subtitle, action, children, className = "" }) {
  return (
    <section className={`sam-glass p-2.5 sm:p-3 ${className}`}>
      {(title || action) && (
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="min-w-0">
            {title ? (
              <h2 className="font-heading text-[15px] font-semibold leading-snug text-foreground">{title}</h2>
            ) : null}
            {subtitle ? <p className="text-[12px] leading-snug text-muted-foreground">{subtitle}</p> : null}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function EmptyLine({ children }) {
  return <p className="rounded-xl bg-background/40 px-3 py-4 text-[15px] text-muted-foreground">{children}</p>;
}

const tones = {
  neutral: "bg-background/50 text-foreground",
  gold: "bg-gold text-gold-foreground",
  navy: "bg-background text-foreground",
  green: "bg-gold text-gold-foreground",
  amber: "bg-gold text-gold-foreground",
  outline: "border-2 border-foreground text-foreground",
};

export function Pill({ children, tone = "neutral" }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[15px] font-medium ${tones[tone] || tones.neutral}`}>
      {children}
    </span>
  );
}