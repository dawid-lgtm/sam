import { Section } from "@/components/ui-kit/Section";
import { DeploySteps } from "@/components/master/DeploySteps";

export function DeploymentPlan({ plan, productKey, onOpenTools }) {
  return (
    <Section title="The deployment plan" subtitle={plan.intro}>
      <DeploySteps plan={plan} productKey={productKey} onOpenTools={onOpenTools} />
    </Section>
  );
}