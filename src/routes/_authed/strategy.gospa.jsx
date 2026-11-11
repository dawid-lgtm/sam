import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, ChevronRight, Lock } from "lucide-react";
import { useSamData } from "@/lib/useSamData";
import { canEditStrategy } from "@/lib/access";
import { GoalEditor } from "@/components/strategy/GoalEditor";
import { ObjectiveCard } from "@/components/strategy/ObjectiveCard";
import { ObjectiveEditor } from "@/components/strategy/ObjectiveEditor";
import { GospaExplainer } from "@/components/strategy/GospaExplainer";
import { NextAdditions } from "@/components/strategy/NextAdditions";
import { Section, EmptyLine } from "@/components/ui-kit/Section";

export const Route = createFileRoute("/_authed/strategy/gospa")({
  component: GoalAndObjectives,
  head: () => ({ meta: [{ title: "Sam — The GOSPA model" }] }),
});

function GoalAndObjectives() {
  const { user } = Route.useRouteContext();
  const { data, isLoading } = useSamData();
  const [editor, setEditor] = useState({ open: false, objective: null });
  const canEdit = canEditStrategy(user);

  if (isLoading || !data) return <div className="h-56 animate-pulse rounded-2xl bg-card" />;

  const atLimit = data.objectives.length >= 5;
  const nextCode = `O${data.objectives.length + 1}`;

  return (
    <div className="space-y-4">
      <GospaExplainer
        company={data.company}
        objectives={data.objectives}
        strategies={data.strategies}
        sites={data.sites}
        canEdit={canEdit}
      />

      <NextAdditions />

      <GoalEditor company={data.company} canEdit={canEdit} />

      <Link
        to="/strategy/changelog"
        className="flex min-h-[48px] items-center justify-between gap-3 rounded-2xl bg-card px-4 py-3"
      >
        <span className="flex items-center gap-2 text-[16px] font-semibold text-foreground">
          <Lock className="h-5 w-5 text-gold" /> The change log
        </span>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </Link>

      <Section
        title="Objectives"
        subtitle={`${data.objectives.length} of 5 in use. One goal, five objectives — five is the ceiling.`}
        action={
          canEdit ? (
            <button
              onClick={() => !atLimit && setEditor({ open: true, objective: null })}
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
          goalStatement={data.company?.goal_sentence || ""}
          onClose={() => setEditor({ open: false, objective: null })}
        />
      ) : null}
    </div>
  );
}