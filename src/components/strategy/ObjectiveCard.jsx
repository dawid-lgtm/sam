import moment from "moment";
import { Pencil } from "lucide-react";
import { Pill } from "@/components/ui-kit/Section";

export function ObjectiveCard({ objective, canEdit, onEdit }) {
  return (
    <div className="rounded-xl bg-background/40 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gold text-[15px] font-semibold text-gold-foreground">
            {objective.code}
          </span>
          <div className="min-w-0">
            <p className="text-[16px] font-medium leading-snug text-foreground">{objective.statement}</p>
            <p className="mt-1 text-[15px] leading-snug text-muted-foreground">
              {objective.metric || "No success metric yet"}
              {objective.target_date ? ` · by ${moment.utc(objective.target_date).format("D MMM YYYY")}` : ""}
            </p>
            {objective.outcome ? (
              <p className="mt-1 text-[15px] leading-snug text-foreground">
                <span className="text-muted-foreground">Outcome: </span>
                {objective.outcome}
              </p>
            ) : null}
            {objective.value_to_business ? (
              <p className="mt-1 text-[15px] leading-snug text-foreground">
                <span className="text-muted-foreground">Value: </span>
                {objective.value_to_business}
              </p>
            ) : null}
          </div>
        </div>
        {canEdit ? (
          <button
            onClick={() => onEdit(objective)}
            aria-label="Edit objective"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-muted-foreground transition hover:bg-card hover:text-foreground"
          >
            <Pencil className="h-5 w-5" />
          </button>
        ) : null}
      </div>

      <div className="mt-3 flex items-center gap-3">
        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-card">
          <div className="h-full rounded-full bg-gold" style={{ width: `${objective.progress || 0}%` }} />
        </div>
        <span className="w-12 text-right text-[15px] font-semibold tabular-nums text-foreground">
          {objective.progress || 0}%
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Pill tone="neutral">Owner {objective.exec_owner || "unset"}</Pill>
        {objective.load_bearing_note ? <Pill tone="gold">Load-bearing</Pill> : null}
      </div>
      {objective.load_bearing_note ? (
        <p className="mt-2 rounded-lg bg-background/60 px-3 py-2 text-[15px] leading-snug text-muted-foreground">
          {objective.load_bearing_note}
        </p>
      ) : null}
    </div>
  );
}