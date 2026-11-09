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
    <div className="mb-3 flex flex-wrap items-center gap-4 text-[15px] text-muted-foreground">
      <span className="flex items-center gap-2">
        <span className="grid h-7 w-11 place-items-center rounded-md bg-gold text-[15px] font-semibold text-gold-foreground">
          Yes
        </span>
        done that month
      </span>
      <span className="flex items-center gap-2">
        <span className="grid h-7 w-11 place-items-center rounded-md border-2 border-foreground text-[15px] font-semibold text-foreground">
          No
        </span>
        did not happen
      </span>
      <span className="flex items-center gap-2">
        <span className="grid h-7 w-11 place-items-center rounded-md border-2 border-dashed border-muted-foreground/60" aria-hidden="true" />
        empty
      </span>
    </div>
  );
}

function Tracker() {
  const { user } = Route.useRouteContext();
  const { data, isLoading } = useSamData();
  const [siteId, setSiteId] = useState(user?.site_id || "");

  if (isLoading || !data) return <div className="h-56 animate-pulse rounded-2xl bg-card" />;

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
            className={`min-h-[48px] rounded-xl px-4 text-[15px] font-semibold transition ${
              s.id === site.id ? "bg-gold text-gold-foreground" : "bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      <Section
        title={`Tracker for ${site.name}`}
        subtitle="Tap a month: Yes, then No, then empty again."
      >
        <Legend />
        {!canEdit ? (
          <p className="mb-3 rounded-xl bg-background/50 px-3 py-2 text-[15px] text-muted-foreground">
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