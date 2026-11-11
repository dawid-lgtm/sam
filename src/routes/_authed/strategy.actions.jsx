import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import moment from "moment";
import { toast } from "sonner";
import { Plus, Pencil } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useSamData, useRefreshSam } from "@/lib/useSamData";
import { canEditSite, isAdministrator } from "@/lib/access";
import { Section, EmptyLine, Pill } from "@/components/ui-kit/Section";
import { ActionEditor } from "@/components/strategy/ActionEditor";

export const Route = createFileRoute("/_authed/strategy/actions")({
  component: ActionRegister,
});

function ActionRegister() {
  const { user } = Route.useRouteContext();
  const { data, isLoading } = useSamData();
  const refresh = useRefreshSam();
  const [editor, setEditor] = useState(null);

  if (isLoading || !data) return <div className="h-56 animate-pulse rounded-2xl bg-card" />;

  const today = moment.utc().startOf("day");
  const isOverdue = (a) => !a.done && a.due && moment.utc(a.due).isBefore(today);
  const canAdd = isAdministrator(user) || canEditSite(user, user?.site_id);

  const tick = async (a) => {
    try {
      await base44.entities.SiteAction.update(a.id, { done: !a.done });
      refresh();
    } catch {
      toast.error("Only that site's team or an administrator can tick this.");
    }
  };

  const sites = data.sites.filter((s) => data.actions.some((a) => a.site_id === s.id));
  const overdueCount = data.actions.filter(isOverdue).length;

  return (
    <Section
      title="The action register"
      subtitle="Every site's actions, read at the site ON the business meeting and again at the regional one. Overdue is shown, not hidden."
      action={
        canAdd ? (
          <button
            onClick={() => setEditor({ key: Date.now() })}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl bg-gold px-3.5 text-[15px] font-semibold text-gold-foreground"
          >
            <Plus className="h-5 w-5" /> Add action
          </button>
        ) : null
      }
    >
      {data.actions.length && overdueCount ? (
        <div className="mb-3 rounded-xl bg-gold/20 px-3 py-2 text-[15px] text-foreground">
          {overdueCount} action{overdueCount === 1 ? "" : "s"} past the completion date.
        </div>
      ) : null}

      {sites.length ? (
        <div className="space-y-4">
          {sites.map((site) => {
            const actions = data.actions
              .filter((a) => a.site_id === site.id)
              .sort((a, b) => String(a.due || "9999").localeCompare(String(b.due || "9999")));
            const canTick = canEditSite(user, site.id);
            const open = actions.filter((a) => !a.done).length;
            const overdue = actions.filter(isOverdue).length;

            return (
              <div key={site.id} className="rounded-xl bg-background/40 p-3">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <Link to="/site/$siteId" params={{ siteId: site.id }} className="text-[16px] font-semibold text-gold">
                    {site.name}
                  </Link>
                  <div className="flex flex-wrap gap-1.5">
                    <Pill tone="neutral">{open} open</Pill>
                    {overdue ? <Pill tone="gold">{overdue} overdue</Pill> : null}
                    {canTick ? (
                      <button
                        onClick={() => setEditor({ key: Date.now(), siteId: site.id })}
                        className="inline-flex min-h-[36px] items-center gap-1 rounded-lg bg-secondary px-2.5 text-[15px] font-medium text-foreground"
                      >
                        <Plus className="h-4 w-4" /> Add
                      </button>
                    ) : null}
                  </div>
                </div>

                <div className="space-y-1.5">
                  {actions.map((a) => (
                    <div
                      key={a.id}
                      className={`flex items-start gap-2 rounded-lg px-3 py-2 ${
                        a.done ? "bg-background/50" : isOverdue(a) ? "bg-gold/20" : "bg-card"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => tick(a)}
                        disabled={!canTick}
                        aria-label={a.done ? "Mark as not done" : "Mark as done"}
                        className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-md border text-[13px] font-semibold transition ${
                          a.done ? "border-gold bg-gold text-gold-foreground" : "border-foreground/40"
                        } ${canTick ? "cursor-pointer" : "opacity-60"}`}
                      >
                        {a.done ? "✓" : ""}
                      </button>
                      <div className="min-w-0 flex-1">
                        <p className={`text-[15px] leading-snug ${a.done ? "text-muted-foreground line-through" : "text-foreground"}`}>
                          {a.action}
                        </p>
                        <p className="mt-0.5 text-[14px] text-muted-foreground">
                          {a.owner || "No owner"} ·{" "}
                          <span className={!a.due ? "font-semibold text-gold" : ""}>
                            {a.due ? moment.utc(a.due).format("D MMM YYYY") : "no completion date"}
                          </span>
                          {a.for_plan ? ` · plan ${a.for_plan}` : ""}
                        </p>
                      </div>
                      {canTick ? (
                        <button
                          onClick={() => setEditor({ key: Date.now(), action: a })}
                          aria-label="Edit action"
                          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-muted-foreground hover:bg-card hover:text-foreground"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyLine>
          Nothing in the register yet.
          {canAdd ? " Use Add action to write the first one against a site — a name and a completion date are both required." : ""}
        </EmptyLine>
      )}

      {editor ? (
        <ActionEditor
          key={editor.key}
          open
          action={editor.action || (editor.siteId ? { site_id: editor.siteId, action: "", for_plan: "", owner: "", due: "" } : null)}
          sites={data.sites}
          plans={data.plans}
          actions={data.actions}
          user={user}
          onClose={() => setEditor(null)}
        />
      ) : null}
    </Section>
  );
}