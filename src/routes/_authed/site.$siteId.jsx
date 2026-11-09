import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useSamData } from "@/lib/useSamData";
import { canEditSite } from "@/lib/access";
import { PageHeader } from "@/components/ui-kit/PageHeader";
import { Section, EmptyLine } from "@/components/ui-kit/Section";
import { ChainView } from "@/components/site/ChainView";
import { AskSection } from "@/components/site/AskSection";
import { TacticSection } from "@/components/site/TacticSection";
import { PlanSection } from "@/components/site/PlanSection";
import { ActionSection } from "@/components/site/ActionSection";

export const Route = createFileRoute("/_authed/site/$siteId")({
  component: SiteDetail,
});

function SiteDetail() {
  const { siteId } = Route.useParams();
  const { user } = Route.useRouteContext();
  const { data, isLoading } = useSamData();

  if (isLoading || !data) return <div className="h-56 animate-pulse rounded-2xl bg-card" />;

  const site = data.sites.find((s) => s.id === siteId);
  if (!site) return <EmptyLine>That site was not found.</EmptyLine>;

  const tactics = data.tactics.filter((t) => t.site_id === site.id);
  const plans = data.plans.filter((p) => p.site_id === site.id);
  const actions = data.actions.filter((a) => a.site_id === site.id);
  const asks = data.asks.filter((a) => a.site_id === site.id);
  const strategies = data.strategies.filter((s) => !s.sites?.length || s.sites.includes(site.id));
  const canEdit = canEditSite(user, site.id);

  return (
    <div>
      <Link to="/site" className="mb-3 inline-flex min-h-[44px] items-center gap-1.5 text-[15px] font-medium text-muted-foreground">
        <ArrowLeft className="h-5 w-5" /> All sites
      </Link>
      <PageHeader
        title={site.name}
        intro={`${site.kind}${site.superintendent ? ` · Superintendent: ${site.superintendent}` : ""}`}
      />

      <div className="space-y-4">
        <Section title="The chain" subtitle="Goal, objective, strategy, tactic, plan and action, in one tree.">
          <ChainView
            goal={data.company?.goal_sentence || ""}
            siteId={site.id}
            objectives={data.objectives}
            strategies={data.strategies}
            tactics={tactics}
            plans={plans}
            actions={actions}
          />
        </Section>

        <AskSection site={site} asks={asks} strategies={strategies} canEdit={canEdit} />
        <TacticSection site={site} tactics={tactics} strategies={strategies} canEdit={canEdit} />
        <PlanSection site={site} plans={plans} tactics={tactics} canEdit={canEdit} />
        <ActionSection site={site} actions={actions} plans={plans} canEdit={canEdit} />
      </div>
    </div>
  );
}