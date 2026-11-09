import { withWords } from "@/lib/labels";

export function ChainView({ goal, siteId, objectives, strategies, tactics, plans, actions }) {
  const siteStrategies = strategies.filter((s) => !s.sites?.length || s.sites.includes(siteId));

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-background/50 p-3">
        <p className="text-[15px] font-medium text-muted-foreground">Goal</p>
        <p className="mt-1 text-[16px] font-medium leading-snug text-foreground">{goal}</p>
      </div>

      {objectives.map((o) => {
        const os = siteStrategies.filter((s) => s.objective_code === o.code);
        if (!os.length) return null;
        return (
          <div key={o.id}>
            <p className="text-[15px] leading-snug text-foreground">
              <span className="mr-1.5 inline-flex rounded bg-gold px-1.5 py-0.5 text-[15px] font-semibold text-gold-foreground">
                {o.code}
              </span>
              {o.statement}
            </p>
            <div className="mt-2 space-y-2 border-l-2 border-muted-foreground/30 pl-3">
              {os.map((s) => {
                const ts = tactics.filter((t) => t.delivers_strategy === s.code);
                return (
                  <div key={s.id}>
                    <p className="text-[15px] leading-snug text-foreground">
                      <span className="mr-1.5 inline-flex rounded bg-background px-1.5 py-0.5 text-[15px] font-semibold text-foreground">
                        {s.code}
                      </span>
                      {s.statement}
                    </p>
                    <div className="mt-1.5 space-y-2 border-l-2 border-muted-foreground/20 pl-3">
                      {ts.length ? (
                        ts.map((t) => {
                          const ps = plans.filter((p) => p.delivers_tactic === t.code);
                          return (
                            <div key={t.id}>
                              <p className="text-[15px] leading-snug text-muted-foreground">
                                {withWords(t.code, t.approach, 999)}
                              </p>
                              <div className="mt-1 flex flex-wrap gap-1.5">
                                {ps.map((p) => (
                                  <span
                                    key={p.id}
                                    className="rounded-md bg-background/60 px-2 py-1 text-[15px] leading-snug text-foreground"
                                  >
                                    {withWords(p.code, p.what, 999)}
                                  </span>
                                ))}
                                {actions
                                  .filter((a) => ps.some((p) => p.code === a.for_plan))
                                  .map((a) => (
                                    <span
                                      key={a.id}
                                      className={`rounded-md px-2 py-1 text-[15px] leading-snug ${
                                        a.done
                                          ? "bg-gold text-gold-foreground"
                                          : "bg-background text-muted-foreground"
                                      }`}
                                    >
                                      {withWords(a.code, a.action, 999)}
                                    </span>
                                  ))}
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-[15px] text-muted-foreground">No tactic yet.</p>
                      )}
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