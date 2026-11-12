const NAV = [
  { label: "Home", active: true },
  { label: "Assess" },
  { label: "Strategy" },
  { label: "Site" },
  { label: "Meetings" },
];

function Card({ title, className = "", children }) {
  return (
    <div className={`rounded-xl bg-card p-2 ${className}`}>
      <p className="text-[11px] font-semibold text-gold">{title}</p>
      <div className="mt-1 space-y-0.5">{children}</div>
    </div>
  );
}

function Bar({ label, pct, note }) {
  return (
    <div className="mb-1">
      <p className="text-[11px] font-medium leading-tight">{label}</p>
      <span className="mt-0.5 block h-1 w-full overflow-hidden rounded-full bg-background/60">
        <span className="block h-full rounded-full bg-gold" style={{ width: `${pct}%` }} />
      </span>
      <p className="text-[10px] text-muted-foreground">
        {pct}% · {note}
      </p>
    </div>
  );
}

export function PhoneDash({ name, role, site, goal, programs, quarter }) {
  return (
    <div className="mx-auto w-full max-w-[360px] overflow-hidden rounded-[26px] border border-foreground/20 bg-background shadow-xl">
      <div className="space-y-2 p-2.5">
        <div className="rounded-2xl bg-card p-2.5">
          <p className="text-[11px] text-gold">Good afternoon</p>
          <p className="font-heading text-[18px] font-semibold leading-tight">Welcome, {name}</p>
          <p className="text-[11px] text-muted-foreground">Thursday, 12 November · 12:28</p>
          <p className="mt-1 text-[10px] leading-snug">
            <b>{role}</b> · {site} · Day crew · Day shift
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Card title="My programs">
            {programs.map((p) => (
              <Bar key={p.label} label={p.label} pct={p.pct} note={p.note} />
            ))}
          </Card>

          <Card title="Key dates">
            <p className="flex gap-1.5 text-[10px] leading-snug">
              <span className="w-8 shrink-0 font-semibold text-gold">20 Nov</span> Site ON the business
            </p>
            <p className="flex gap-1.5 text-[10px] leading-snug">
              <span className="w-8 shrink-0 font-semibold text-gold">24 Nov</span> Head office ON
            </p>
            <p className="flex gap-1.5 text-[10px] leading-snug">
              <span className="w-8 shrink-0 font-semibold text-gold">12 Feb</span> 90-day tactic review
            </p>
          </Card>

          <Card title="Site this week">
            <p className="flex justify-between text-[10px]"><span>Availability</span><b>87%</b></p>
            <p className="flex justify-between text-[10px]"><span>Cost per tonne</span><b>$31.40</b></p>
            <p className="flex justify-between text-[10px]"><span>TRIFR</span><b>0.0</b></p>
          </Card>

          <Card title="Safety focus">
            <p className="text-[10px] leading-snug">• Loader handover at the face</p>
            <p className="text-[10px] leading-snug">• Isolation audit, 4 North</p>
          </Card>

          <Card title="This quarter" className="col-span-2">
            <p className="text-[10px] font-medium leading-snug">{goal}</p>
            <p className="text-[10px] text-muted-foreground">{quarter}</p>
          </Card>

          <Card title="Your day in four blocks" className="col-span-2">
            <div className="grid grid-cols-4 gap-1">
              {["Safety", "Plan", "People", "Improve"].map((b) => (
                <span key={b} className="rounded bg-background/60 py-1 text-center text-[9px]">{b}</span>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <nav className="flex border-t border-foreground/10 bg-background">
        {NAV.map((n) => (
          <span
            key={n.label}
            className={`flex flex-1 flex-col items-center gap-0.5 py-1.5 text-[9px] ${
              n.active ? "font-semibold text-foreground" : "text-muted-foreground"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${n.active ? "bg-gold" : "bg-foreground/30"}`} />
            {n.label}
          </span>
        ))}
      </nav>
    </div>
  );
}