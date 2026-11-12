export function Frame({ label, children }) {
  return (
    <div className="mx-auto w-full max-w-[360px] rounded-[26px] border border-foreground/20 bg-background p-3 shadow-xl">
      <div className="mb-2 flex items-center justify-between px-1">
        <p className="text-[13px] font-semibold text-gold">{label}</p>
        <span className="flex gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-foreground/30" />
          <span className="h-1.5 w-1.5 rounded-full bg-foreground/30" />
          <span className="h-1.5 w-1.5 rounded-full bg-foreground/30" />
        </span>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

export function MockCard({ title, note, gold, children }) {
  return (
    <div className={`rounded-xl p-2.5 ${gold ? "bg-gold/15 ring-1 ring-gold" : "bg-card"}`}>
      {title ? <p className={`text-[14px] font-semibold ${gold ? "text-gold" : ""}`}>{title}</p> : null}
      {note ? <p className="text-[12px] text-muted-foreground">{note}</p> : null}
      {children ? <div className="mt-1.5 space-y-1 text-[13px] leading-snug">{children}</div> : null}
    </div>
  );
}

export function MockRow({ children, arrow }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-xl bg-background/40 px-2.5 py-2 text-[13px]">
      <span className="min-w-0">{children}</span>
      {arrow ? <span className="shrink-0 text-gold">›</span> : null}
    </div>
  );
}

export function MockField({ label, value, faded }) {
  return (
    <div>
      {label ? <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p> : null}
      <p className={`rounded-lg bg-background/60 px-2 py-1.5 text-[13px] ${faded ? "text-muted-foreground" : ""}`}>
        {value || "—"}
      </p>
    </div>
  );
}

export function MockTap({ children, locked, quiet }) {
  return (
    <div
      className={`rounded-lg px-2.5 py-2 text-center text-[13px] font-semibold ${
        locked
          ? "bg-gold/40 text-gold-foreground/80 ring-1 ring-gold/60"
          : quiet
            ? "bg-background/50 text-foreground ring-1 ring-foreground/25"
            : "bg-gold text-gold-foreground"
      }`}
    >
      {children}
    </div>
  );
}

export function MockPill({ children }) {
  return (
    <span className="inline-flex rounded bg-gold px-1.5 py-0.5 text-[11px] font-semibold text-gold-foreground">
      {children}
    </span>
  );
}