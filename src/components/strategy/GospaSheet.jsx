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
  const example = GOSPA_SHEET.example;

  return (
    <Section
      title="The one-page sheet"
      subtitle="One goal, the five objectives under it, then one objective worked all the way down to its strategies and each site's tactics, plans and actions."
    >
      <div className="space-y-3">
        <div className="rounded-xl bg-gold px-3 py-3 text-center">
          <p className="text-[14px] font-semibold uppercase tracking-wide text-gold-foreground">Goal · one line</p>
          <p className="mt-0.5 font-heading text-[19px] font-semibold leading-snug text-gold-foreground">
            {GOSPA_SHEET.goal}
          </p>
        </div>

        <div className="rounded-xl bg-card px-3 py-3">
          <p className="text-[14px] font-semibold uppercase tracking-wide text-gold">
            Five objectives · no more than five
          </p>
          <ul className="mt-2 space-y-1.5">
            {GOSPA_SHEET.objectives.map((o) => (
              <li
                key={o.code}
                className={`rounded-lg px-2.5 py-2 text-[15px] leading-snug ${
                  o.code === example.code ? "bg-gold/20 text-foreground" : "bg-background/40 text-foreground"
                }`}
              >
                <span className="mr-1.5 font-semibold text-gold">{o.code}</span>
                {o.statement}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl bg-background/30 px-3 py-3">
          <p className="text-[14px] font-semibold uppercase tracking-wide text-gold">
            {example.code} worked as the example
          </p>
          <p className="mt-1 text-[15px] leading-snug text-foreground">{example.statement}</p>

          <div className="mt-2 space-y-2">
            {example.strategies.map((s) => (
              <div key={s.code} className="border-l-2 border-gold/50 pl-3">
                <div className="rounded-lg bg-background/40 px-3 py-2">
                  <p className="text-[15px] leading-snug text-foreground">
                    <span className="mr-1.5 text-[14px] font-semibold text-gold">{s.code}</span>
                    {s.statement}
                  </p>
                </div>

                {s.sites?.length ? (
                  <div className="mt-1.5 space-y-1.5 border-l-2 border-foreground/20 pl-3">
                    <p className="text-[14px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Three sites carry it · tactic, plan, action
                    </p>
                    {s.sites.map((row) => (
                      <Site key={`${s.code}-${row.site}`} row={row} />
                    ))}
                  </div>
                ) : (
                  <p className="mt-1.5 pl-3 text-[15px] leading-snug text-muted-foreground">
                    Each site fills in its own tactics, plans and actions underneath this strategy.
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      <p className="mt-3 rounded-xl bg-background/50 px-3 py-2.5 text-[15px] leading-snug text-foreground">
        This is an example. On the real sheet the goal and the five objectives are written once, and each site fills in
        its own tactics, plans and actions underneath the strategies it carries.
      </p>
    </Section>
  );
}