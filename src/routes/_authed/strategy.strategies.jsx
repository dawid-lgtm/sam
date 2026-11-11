import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import moment from "moment";
import { Plus, Pencil } from "lucide-react";
import { useSamData } from "@/lib/useSamData";
import { canEditStrategy } from "@/lib/access";
import { Section, EmptyLine, Pill } from "@/components/ui-kit/Section";
import { StrategyEditor } from "@/components/strategy/StrategyEditor";

export const Route = createFileRoute("/_authed/strategy/strategies")({
  component: Strategies,
});

function Strategies() {
  const { user } = Route.useRouteContext();
  const { data, isLoading } = useSamData();
  const [editor, setEditor] = useState({ open: false, strategy: null });
  const canEdit = canEditStrategy(user);

  if (isLoading || !data) return <div className="h-56 animate-pulse rounded-2xl bg-card" />;

  const atLimit = data.strategies.length >= 8;
  const nextCode = `S${data.strategies.length + 1}`;
  const siteName = (id) => data.sites.find((s) => s.id === id)?.name || "—";

  return (
    <div>
      <Section
        title="Strategies"
        subtitle={`${data.strategies.length} of 8 in use. Each one serves an objective.`}
        action={
          canEdit ? (
            <button
              onClick={() => !atLimit && setEditor({ open: true, strategy: null })}
              disabled={atLimit}
              className="inline-flex min-h-[48px] items-center gap-1.5 rounded-xl bg-secondary px-3.5 text-[15px] font-semibold text-foreground transition disabled:opacity-40"
            >
              <Plus className="h-5 w-5" /> Add
            </button>
          ) : null
        }
      >
        {atLimit && canEdit ? (
          <p className="mb-3 rounded-xl bg-background/50 px-3 py-2 text-[15px] text-foreground">
            Eight strategies already. Retire one before adding another.
          </p>
        ) : null}

        <div className="space-y-3">
          {data.strategies.length ? (
            data.strategies.map((s) => (
              <div key={s.id} className="rounded-xl bg-background/40 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 gap-3">
                    <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gold text-[15px] font-semibold text-gold-foreground">
                      {s.code}
                    </span>
                    <p className="text-[16px] font-medium leading-snug text-foreground">{s.statement}</p>
                  </div>
                  {canEdit ? (
                    <button
                      onClick={() => setEditor({ open: true, strategy: s })}
                      aria-label="Edit strategy"
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-muted-foreground transition hover:bg-card hover:text-foreground"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                  ) : null}
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  <Pill tone="gold">Serves {s.objective_code || "—"}</Pill>
                  <Pill tone="neutral">Owner {s.owner || "unset"}</Pill>
                  {s.deliver_month ? (
                    <Pill tone="neutral">By {moment.utc(`${s.deliver_month}-01`).format("MMMM YYYY")}</Pill>
                  ) : null}
                  {(s.sites || []).map((id) => (
                    <Pill key={id} tone="neutral">
                      {siteName(id)}
                    </Pill>
                  ))}
                </div>

                <dl className="mt-3 grid grid-cols-2 gap-2 text-[15px]">
                  <div className="rounded-lg bg-background/60 px-3 py-2">
                    <dt className="text-muted-foreground">Value volume</dt>
                    <dd className="mt-0.5 font-medium text-foreground">{s.value_volume || "—"}</dd>
                  </div>
                  <div className="rounded-lg bg-background/60 px-3 py-2">
                    <dt className="text-muted-foreground">Value in dollars</dt>
                    <dd className="mt-0.5 font-medium text-foreground">{s.value_dollars || "—"}</dd>
                  </div>
                  <div className="rounded-lg bg-background/60 px-3 py-2">
                    <dt className="text-muted-foreground">Success metric</dt>
                    <dd className="mt-0.5 font-medium text-foreground">{s.success_metric || "—"}</dd>
                  </div>
                  <div className="rounded-lg bg-background/60 px-3 py-2">
                    <dt className="text-muted-foreground">Deliver date</dt>
                    <dd className="mt-0.5 font-medium text-foreground">
                      {s.deliver_date ? moment.utc(s.deliver_date).format("D MMM YYYY") : "—"}
                    </dd>
                  </div>
                </dl>
                <p className="mt-2 text-[15px] text-muted-foreground">
                  90-day review: {s.review_date ? moment.utc(s.review_date).format("D MMM YYYY") : "not set"}
                </p>
              </div>
            ))
          ) : (
            <EmptyLine>No strategies yet.</EmptyLine>
          )}
        </div>
      </Section>

      {canEdit ? (
        <StrategyEditor
          key={editor.strategy?.id || `new-${nextCode}`}
          open={editor.open}
          strategy={editor.strategy}
          nextCode={editor.strategy?.code || nextCode}
          objectives={data.objectives}
          sites={data.sites}
          onClose={() => setEditor({ open: false, strategy: null })}
        />
      ) : null}
    </div>
  );
}