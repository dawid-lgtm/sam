import { Section } from "@/components/ui-kit/Section";
import { DeployFlow } from "@/components/master/DeployFlow";

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
      <div className="grid gap-4 lg:grid-cols-2">
        {plan.streams.map((s) => (
          <Stream key={s.name} stream={s} />
        ))}
      </div>
    </div>
  );
}