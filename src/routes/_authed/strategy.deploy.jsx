import { createFileRoute } from "@tanstack/react-router";
import { DEPLOYMENT_PLANS } from "@/lib/deploymentPlan";
import { DeploymentPlan } from "@/components/master/DeploymentPlan";
import { PageHeader } from "@/components/ui-kit/PageHeader";

export const Route = createFileRoute("/_authed/strategy/deploy")({
  component: DeployPage,
  head: () => ({ meta: [{ title: "Sam — How the program is deployed" }] }),
});

function DeployPage() {
  return (
    <div>
      <PageHeader
        title="How the program is deployed"
        intro="Three steps. Nothing moves to the next one until the gate at the end of this one is met."
      />
      <DeploymentPlan plan={DEPLOYMENT_PLANS.strategy} />
    </div>
  );
}