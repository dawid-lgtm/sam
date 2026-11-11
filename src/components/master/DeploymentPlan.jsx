import { Section } from "@/components/ui-kit/Section";
import { DeployFlow } from "@/components/master/DeployFlow";

export function DeploymentPlan({ plan }) {
  return (
    <div className="space-y-4">
      <Section title="The deployment plan">
        <p className="mb-2 text-[13px] leading-snug text-muted-foreground">{plan.intro}</p>
        <DeployFlow phases={plan.phases} />
      </Section>
    </div>
  );
}