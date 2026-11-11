import { Flag } from "lucide-react";
import { Section } from "@/components/ui-kit/Section";

function Phase({ phase }) {
  return (
    <div className="rounded-xl bg-background/40 p-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-gold font-heading text-[16px] font-bold text-gold-foreground">
          {phase.n}
        </span>
        <h3 className="font-heading text-[18px] font-semibold">{phase.name}</h3>
        <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[14px] font-medium">{phase.status}</span>
      </div>
      <div className="mt-3 space-y-3">
        {phase.blocks.map((b) => (
          <div key={b.h}>
            <p className="text-[15px] font-semibold text-gold">{b.h}</p>
            <ul className="mt-1 list-disc space-y-0.5 pl-5 text-[15px]">
              {b.items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-lg bg-card p-3">
        <p className="flex items-center gap-1.5 text-[15px] font-semibold">
          <Flag className="h-4 w-4 text-gold" /> Gate {phase.n}
        </p>
        <ol className="mt-1 list-decimal space-y-0.5 pl-5 text-[15px]">
          {phase.gate.map((g) => (
            <li key={g}>{g}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}

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
      <Section title="The deployment plan" subtitle={plan.intro}>
        <div className="space-y-3">
          {plan.phases.map((p) => (
            <Phase key={p.n} phase={p} />
          ))}
        </div>
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