import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useSamData } from "@/lib/useSamData";
import { canEditSite } from "@/lib/access";
import { TrackerGrid } from "@/components/strategy/TrackerGrid";
import { Section, EmptyLine } from "@/components/ui-kit/Section";

export const Route = createFileRoute("/_authed/strategy/tracker")({
  component: Tracker,
});

function Legend() {
  return (
    <div className="mb-3 flex flex-wrap items-center gap-3 text-[12px] text-muted-foreground">
      <span className="flex items-center gap-1.5"><span className="h-4 w-4 rounded bg-emerald-500" /> Y — done that month</span>
      <span className="flex items-center gap-1.5"><span className="h-4 w-4 rounded bg-secondary" /> blank — not started</span>
      <span className="flex items-center gap-1.5"><span className="h-4 w-4 rounded bg-amber-400" /> N — did not happen</span>
    </div>
  );
}

function Tracker() {
  const { user } = Route.useRouteContext();
  const { data, isLoading } = useSamData();
  const [siteId, setSiteId] = useState(user?.site_id || "");

  if (isLoading || !data) return <div className="h-56 animate-pulse rounded-2xl bg-white" />;

  const site = data.sites.find((s) => s.id === siteId) || data.sites[0];
  if (!site) return <EmptyLine>No sites yet.</EmptyLine>;

  const strategies = data.strategies.filter((s) => !s.sites?.length || s.sites.includes(site.id));
  const canEdit = canEditSite(user, site.id);

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {data.sites.map((s) => (
          <button
            key={s.id}
            onClick={() => setSiteId(s.id)}
            className={`min-h-[44px] rounded-full px-4 text-sm font-semibold transition ${
              s.id === site.id ? "bg-navy text-white" : "bg-white text-muted-foreground hover:text-navy"
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      <Section
        title={`Tracker — ${site.name}`}
        subtitle="Tap a month to cycle Y → N → blank. Quarterly value is volume and dollars."
      >
        <Legend />
        {!canEdit ? (
          <p className="mb-3 rounded-xl bg-secondary/60 px-3 py-2 text-[13px] text-muted-foreground">
            View only. Site teams keep this tracker.
          </p>
        ) : null}
        {strategies.length ? (
          <TrackerGrid site={site} strategies={strategies} trackers={data.trackers} canEdit={canEdit} />
        ) : (
          <EmptyLine>No strategies ask anything of this site yet.</EmptyLine>
        )}
      </Section>
    </div>
  );
}