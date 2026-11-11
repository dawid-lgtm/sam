import { GOSPA_SHEET } from "@/lib/gospaSheet";
import { Section } from "@/components/ui-kit/Section";

function Site({ row }) {
  return (
    <div className="rounded-lg bg-background/40 p-2.5">
      <p className="text-[15px] leading-snug text-foreground">
        <span className="mr-1.5 rounded-md bg-gold px-1.5 py-0.5 text-[14px] font-semibold text-gold-foreground">
          {row.site}
        </span>
        {row.tactic}
      </p>
      <p className="mt-1 text-[15px] leading-snug text-muted-foreground">
        <b className="text-foreground">Plan</b> {row.plan}
      </p>
      <p className="text-[15px] leading-snug text-muted-foreground">
        <b className="text-foreground">Action</b> {row.action}
      </p>
    </div>
  );
}

export function GospaSheet() {
  return (
    <Section
      title="The one-page sheet"
      subtitle="What a finished sheet looks like: one goal, the objectives under it, two strategies each, and every site's tactics, plans and actions below that."
    >
      <div className="overflow-x-auto">
        <div className="min-w-[540px] space-y-3">
          <div className="rounded-xl bg-gold px-3 py-3 text-center">
            <p className="text-[14px] font-semibold uppercase tracking-wide text-gold-foreground">Goal</p>
            <p className="mt-0.5 font-heading text-[19px] font-semibold leading-snug text-gold-foreground">
              {GOSPA_SHEET.goal}
            </p>
          </div>

          {GOSPA_SHEET.objectives.map((o) => (
            <div key={o.code} className="border-l-2 border-gold/50 pl-3">
              <div className="rounded-xl bg-card px-3 py-2.5">
                <p className="text-[15px] leading-snug text-foreground">
                  <span className="mr-1.5 rounded-md bg-background/60 px-1.5 py-0.5 text-[14px] font-semibold">
                    {o.code}
                  </span>
                  {o.statement}
                </p>
              </div>

              <div className="mt-2 space-y-2">
                {o.strategies.map((s) => (
                  <div key={s.code} className="border-l-2 border-foreground/20 pl-3">
                    <div className="rounded-lg bg-background/30 px-3 py-2">
                      <p className="text-[15px] leading-snug text-foreground">
                        <span className="mr-1.5 text-[14px] font-semibold text-gold">{s.code}</span>
                        {s.statement}
                      </p>
                    </div>

                    <div className="mt-1.5 space-y-1.5 border-l-2 border-foreground/10 pl-3">
                      {s.sites.map((row) => (
                        <Site key={`${s.code}-${row.site}`} row={row} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-3 rounded-xl bg-background/50 px-3 py-2.5 text-[15px] leading-snug text-foreground">
        This is an example. On the real sheet the goal and objectives are written once, and each site fills in its own
        tactics, plans and actions underneath the strategies it carries.
      </p>
    </Section>
  );
}