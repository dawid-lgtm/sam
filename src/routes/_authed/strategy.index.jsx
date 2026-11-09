import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useSamData } from "@/lib/useSamData";
import { canEditStrategy } from "@/lib/access";
import { GoalEditor } from "@/components/strategy/GoalEditor";
import { ObjectiveCard } from "@/components/strategy/ObjectiveCard";
import { ObjectiveEditor } from "@/components/strategy/ObjectiveEditor";
import { Section, EmptyLine } from "@/components/ui-kit/Section";

export const Route = createFileRoute("/_authed/strategy/")({
  component: GoalAndObjectives,
});

function GoalAndObjectives() {
  const { user } = Route.useRouteContext();
  const { data, isLoading } = useSamData();
  const [editor, setEditor] = useState({ open: false, objective: null });
  const canEdit = canEditStrategy(user);

  if (isLoading || !data) return <div className="h-56 animate-pulse rounded-2xl bg-white" />;

  const atLimit = data.objectives.length >= 5;
  const nextCode = `O${data.objectives.length + 1}`;

  return (
    <div className="space-y-4">
      <GoalEditor company={data.company} canEdit={canEdit} />

      <Section
        title="Objectives"
        subtitle={`${data.objectives.length} of 5 in use. Five is the ceiling.`}
        action={
          canEdit ? (
            <button
              onClick={() => !atLimit && setEditor({ open: true, objective: null })}
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
            Five objectives already. Retire or merge one before adding a sixth.
          </p>
        ) : null}
        <div className="space-y-3">
          {data.objectives.length ? (
            data.objectives.map((o) => (
              <ObjectiveCard
                key={o.id}
                objective={o}
                canEdit={canEdit}
                onEdit={(objective) => setEditor({ open: true, objective })}
              />
            ))
          ) : (
            <EmptyLine>No objectives yet.</EmptyLine>
          )}
        </div>
      </Section>

      {canEdit ? (
        <ObjectiveEditor
          key={editor.objective?.id || `new-${nextCode}`}
          open={editor.open}
          objective={editor.objective}
          nextCode={editor.objective?.code || nextCode}
          onClose={() => setEditor({ open: false, objective: null })}
        />
      ) : null}
    </div>
  );
}