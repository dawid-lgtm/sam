export function ChainView({ goal, siteId, objectives, strategies, tactics, plans, actions }) {
  const siteStrategies = strategies.filter((s) => !s.sites?.length || s.sites.includes(siteId));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {["Goal", "Objective", "Strategy", "Tactic", "Plan", "Action"].map((step, i, arr) => (
          <span key={step} className="flex items-center gap-1.5">
            <span className="rounded-md bg-secondary px-1.5 py-1">{step}</span>
            {i < arr.length - 1 ? <span className="text-muted-foreground/50">›</span> : null}
          </span>
        ))}
      </div>

      <div className="rounded-xl bg-navy p-3 text-white">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gold">Goal</p>
        <p className="mt-1 text-[14px] font-medium leading-snug">{goal}</p>
      </div>

      {objectives.map((o) => {
        const os = siteStrategies.filter((s) => s.objective_code === o.code);
        if (!os.length) return null;
        return (
          <div key={o.id}>
            <p className="text-[13px] leading-snug text-navy">
              <span className="mr-1.5 rounded bg-accent px-1.5 py-0.5 text-[11px] font-bold text-[#7a6114]">{o.code}</span>
              {o.statement}
            </p>
            <div className="mt-1.5 space-y-2 border-l-2 border-border pl-3">
              {os.map((s) => {
                const ts = tactics.filter((t) => t.delivers_strategy === s.code);
                return (
                  <div key={s.id}>
                    <p className="text-[13px] leading-snug text-navy">
                      <span className="mr-1.5 rounded bg-navy px-1.5 py-0.5 text-[11px] font-bold text-white">{s.code}</span>
                      {s.statement}
                    </p>
                    <div className="mt-1 space-y-1.5 border-l border-border pl-3">
                      {ts.length ? ts.map((t) => {
                        const ps = plans.filter((p) => p.delivers_tactic === t.code);
                        return (
                          <div key={t.id}>
                            <p className="text-[12px] leading-snug text-muted-foreground">
                              <span className="mr-1.5 rounded bg-secondary px-1.5 py-0.5 text-[11px] font-bold text-navy">{t.code}</span>
                              {t.approach}
                            </p>
                            <div className="mt-1 flex flex-wrap gap-1 pl-1">
                              {ps.map((p) => (
                                <span key={p.id} className="rounded bg-secondary/70 px-1.5 py-0.5 text-[11px] text-navy">
                                  {p.code}
                                </span>
                              ))}
                              {actions
                                .filter((a) => ps.some((p) => p.code === a.for_plan))
                                .map((a) => (
                                  <span
                                    key={a.id}
                                    className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${
                                      a.done ? "bg-emerald-100 text-emerald-800" : "bg-gold/15 text-[#7a6114]"
                                    }`}
                                  >
                                    {a.code}
                                  </span>
                                ))}
                            </div>
                          </div>
                        );
                      }) : <p className="text-[12px] text-muted-foreground/70">No tactic yet.</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}