import { Section } from "@/components/ui-kit/Section";
import { DeploySteps } from "@/components/master/DeploySteps";

export function DeploymentPlan({ plan, productKey }) {
  return (
    <Section title="The deployment plan" subtitle={plan.intro}>
      <DeploySteps plan={plan} productKey={productKey} />
    </Section>
  );
}