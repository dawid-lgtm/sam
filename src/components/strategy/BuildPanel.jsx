import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Hammer } from "lucide-react";
import { GoalBuilder } from "@/components/strategy/GoalBuilder";
import { ObjectiveEditor } from "@/components/strategy/ObjectiveEditor";
import { StrategyEditor } from "@/components/strategy/StrategyEditor";

const buttonClass =
  "inline-flex min-h-[44px] items-center gap-1.5 rounded-lg bg-gold px-3.5 text-[15px] font-semibold text-gold-foreground transition disabled:opacity-50";

export function BuildPanel({ layerKey, company, objectives, strategies, sites, canEdit }) {
  const [open, setOpen] = useState(false);
  const [objectiveOpen, setObjectiveOpen] = useState(false);
  const [strategyOpen, setStrategyOpen] = useState(false);

  if (layerKey === "p" || layerKey === "a") {
    return (
      <div className="mt-3 rounded-xl bg-background/60 p-3">
        <p className="text-[15px] font-semibold text-foreground">
          {layerKey === "p" ? "Build a site's plans" : "Build a site's actions"}
        </p>
        <p className="mt-0.5 text-[14px] leading-snug text-muted-foreground">
          {layerKey === "p"
            ? "Plans belong to one site, under a Strategy. Pick the site and its builder opens on that page."
            : "Actions belong to one site, under a Plan. Pick the site and its builder opens on that page."}
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {sites?.length ? (
            sites.map((s) => (
              <Link
                key={s.id}
                to="/site/$siteId"
                params={{ siteId: s.id }}
                className="min-h-[44px] rounded-lg bg-secondary px-3.5 text-[15px] font-medium text-foreground"
              >
                {s.name}
              </Link>
            ))
          ) : (
            <span className="text-[14px] text-muted-foreground">No sites yet. An administrator adds them.</span>
          )}
        </div>
      </div>
    );
  }

  if (!canEdit) {
    return (
      <p className="mt-3 rounded-xl bg-background/60 p-3 text-[14px] leading-snug text-muted-foreground">
        The Goal, Objectives and Strategies are built by the administrator and executive accounts.
      </p>
    );
  }

  if (layerKey === "g") {
    return (
      <div className="mt-3">
        <button type="button" onClick={() => setOpen(true)} className={buttonClass}>
          <Hammer className="h-4 w-4" />
          {company?.goal_sentence ? "Rebuild the goal" : "Build the goal"}
        </button>
        {open ? <GoalBuilder open company={company} onClose={() => setOpen(false)} /> : null}
      </div>
    );
  }

  if (layerKey === "o") {
    const atLimit = (objectives?.length || 0) >= 5;
    return (
      <div className="mt-3">
        <button
          type="button"
          onClick={() => setObjectiveOpen(true)}
          disabled={atLimit}
          className={buttonClass}
        >
          <Hammer className="h-4 w-4" />
          {atLimit ? "Five objectives already" : "Build an objective"}
        </button>
        <p className="mt-1.5 text-[14px] leading-snug text-muted-foreground">
          The Goal is added to the template for you, so the objective starts from it.
        </p>
        {objectiveOpen ? (
          <ObjectiveEditor
            open
            objective={null}
            nextCode={`O${(objectives?.length || 0) + 1}`}
            goalStatement={company?.goal_sentence || ""}
            onClose={() => setObjectiveOpen(false)}
          />
        ) : null}
      </div>
    );
  }

  const parent = objectives?.[0];
  const noObjectives = !objectives?.length;

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={() => setStrategyOpen(true)}
        disabled={noObjectives}
        className={buttonClass}
      >
        <Hammer className="h-4 w-4" />
        {noObjectives ? "Add an objective first" : "Build a strategy"}
      </button>
      <p className="mt-1.5 text-[14px] leading-snug text-muted-foreground">
        The Objective is added to the template for you
        {parent && objectives.length === 1 ? ` — ${parent.code}: ${parent.statement}` : ""}.
      </p>
      {strategyOpen && !noObjectives ? (
        <StrategyEditor
          open
          strategy={null}
          nextCode={`S${(strategies?.length || 0) + 1}`}
          objectives={objectives}
          sites={sites || []}
          presetObjective={objectives.length === 1 ? parent.code : ""}
          onClose={() => setStrategyOpen(false)}
        />
      ) : null}
    </div>
  );
}