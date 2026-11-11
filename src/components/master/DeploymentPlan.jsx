import { Section } from "@/components/ui-kit/Section";
import { DeployFlow } from "@/components/master/DeployFlow";

export function DeploymentPlan({ plan }) {
  return (
    <Section title="The deployment plan" subtitle={plan.intro}>
      <DeployFlow phases={plan.phases} />
    </Section>
  );
}