import { Section } from "@/components/ui-kit/Section";
import { DeployFlow } from "@/components/master/DeployFlow";

function Rhythm({ rhythm }) {
  return (
    <Section title={rhythm.title} subtitle={rhythm.note}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-separate border-spacing-1 text-[15px]">
          <thead>
            <tr>
              <th />
              {[1, 2, 3, 4].map((w) => (
                <th key={w} className="px-2 py-1 text-left font-semibold">
                  Week {w}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rhythm.rows.map((r, ri) => (
              <tr key={r.who}>
                <th className="px-2 py-1 text-left font-semibold">{r.who}</th>
                {r.cells.map((c, ci) => (
                  <td
                    key={ci}
                    className={`rounded-lg px-2 py-2 ${(rhythm.onIndex[ri] || []).includes(ci) ? "bg-gold font-semibold text-gold-foreground" : "bg-background/40"}`}
                  >
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

function Stream({ stream }) {
  return (
    <Section title={stream.name}>
      <div className="space-y-1.5">
        {stream.steps.map(([step, who]) => (
          <div key={step} className="rounded-lg bg-background/40 p-2.5 text-[15px]">
            <p>{step}</p>
            <p className="mt-0.5 text-[14px] text-gold">{who}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function DeploymentPlan({ plan }) {
  return (
    <div className="space-y-4">
      <Section title="The deployment plan">
        <p className="mb-2 text-[13px] leading-snug text-muted-foreground">{plan.intro}</p>
        <DeployFlow phases={plan.phases} />
      </Section>
      <Rhythm rhythm={plan.rhythm} />
      <div className="grid gap-4 lg:grid-cols-2">
        {plan.streams.map((s) => (
          <Stream key={s.name} stream={s} />
        ))}
      </div>
    </div>
  );
}