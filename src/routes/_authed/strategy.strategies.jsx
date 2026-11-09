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

  if (isLoading || !data) return <div className="h-56 animate-pulse rounded-2xl bg-white" />;

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
              className="inline-flex min-h-[40px] items-center gap-1 rounded-xl border border-border px-3 text-[13px] font-semibold text-navy transition hover:bg-secondary disabled:opacity-40"
            >
              <Plus className="h-4 w-4" /> Add
            </button>
          ) : null
        }
      >
        {atLimit && canEdit ? (
          <p className="mb-3 rounded-xl bg-accent px-3 py-2 text-[13px] text-[#7a6114]">
            Eight strategies already. Retire one before adding another.
          </p>
        ) : null}

        <div className="space-y-3">
          {data.strategies.length ? (
            data.strategies.map((s) => (
              <div key={s.id} className="rounded-2xl border border-border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 gap-3">
                    <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-navy text-[13px] font-bold text-white">
                      {s.code}
                    </span>
                    <p className="text-[15px] font-semibold leading-snug text-navy">{s.statement}</p>
                  </div>
                  {canEdit ? (
                    <button
                      onClick={() => setEditor({ open: true, strategy: s })}
                      aria-label="Edit strategy"
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-muted-foreground transition hover:bg-secondary"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  ) : null}
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  <Pill tone="gold">Serves {s.objective_code || "—"}</Pill>
                  <Pill tone="neutral">Owner {s.owner || "unset"}</Pill>
                  {(s.sites || []).map((id) => (
                    <Pill key={id} tone="neutral">{siteName(id)}</Pill>
                  ))}
                </div>

                <dl className="mt-3 grid grid-cols-2 gap-2 text-[13px]">
                  <div className="rounded-xl bg-secondary/60 px-3 py-2">
                    <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">Value volume</dt>
                    <dd className="mt-0.5 font-medium text-navy">{s.value_volume || "—"}</dd>
                  </div>
                  <div className="rounded-xl bg-secondary/60 px-3 py-2">
                    <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">Value $</dt>
                    <dd className="mt-0.5 font-medium text-navy">{s.value_dollars || "—"}</dd>
                  </div>
                </dl>
                <p className="mt-2 text-xs text-muted-foreground">
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