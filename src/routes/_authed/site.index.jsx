import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Mountain } from "lucide-react";
import { useSamData } from "@/lib/useSamData";
import { PageHeader } from "@/components/ui-kit/PageHeader";

export const Route = createFileRoute("/_authed/site/")({
  component: SiteList,
  head: () => ({ meta: [{ title: "Sam — Sites" }] }),
});

function SiteList() {
  const { user } = Route.useRouteContext();
  const { data, isLoading } = useSamData();
  if (isLoading || !data) return <div className="h-56 animate-pulse rounded-2xl bg-card" />;

  return (
    <div>
      <PageHeader title="Sites" intro="Pick a site to see what the strategy asks of it, and the work that follows." />
      <div className="space-y-3">
        {data.sites.map((site) => {
          const openActions = data.actions.filter((a) => a.site_id === site.id && !a.done).length;
          const tactics = data.tactics.filter((t) => t.site_id === site.id).length;
          return (
            <Link key={site.id} to="/site/$siteId" params={{ siteId: site.id }} className="flex items-center gap-3 rounded-2xl bg-card p-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold text-gold-foreground">
                <Mountain className="h-6 w-6" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-heading text-[18px] font-semibold text-foreground">{site.name}</p>
                <p className="text-[15px] text-muted-foreground">
                  {site.kind} · {site.superintendent || "no superintendent"}
                </p>
                <p className="mt-1 text-[15px] text-muted-foreground">
                  {tactics} tactics · {openActions} open actions
                  {user?.site_id === site.id ? " · your site" : ""}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}