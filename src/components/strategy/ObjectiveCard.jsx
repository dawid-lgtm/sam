import moment from "moment";
import { Pencil } from "lucide-react";
import { Pill } from "@/components/ui-kit/Section";

export function ObjectiveCard({ objective, canEdit, onEdit }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent text-[13px] font-bold text-[#7a6114]">
            {objective.code}
          </span>
          <div className="min-w-0">
            <p className="text-[15px] font-semibold leading-snug text-navy">{objective.statement}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {objective.metric || "No measure yet"}
              {objective.target_date ? ` · by ${moment.utc(objective.target_date).format("D MMM YYYY")}` : ""}
            </p>
          </div>
        </div>
        {canEdit ? (
          <button
            onClick={() => onEdit(objective)}
            aria-label="Edit objective"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-muted-foreground transition hover:bg-secondary"
          >
            <Pencil className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      <div className="mt-3 flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
          <div className="h-full rounded-full bg-gold" style={{ width: `${objective.progress || 0}%` }} />
        </div>
        <span className="w-9 text-right text-xs font-semibold tabular-nums text-navy">{objective.progress || 0}%</span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Pill tone="neutral">Owner {objective.exec_owner || "unset"}</Pill>
        {objective.load_bearing_note ? <Pill tone="gold">Load-bearing</Pill> : null}
      </div>
      {objective.load_bearing_note ? (
        <p className="mt-2 rounded-xl bg-secondary/60 px-3 py-2 text-[13px] leading-snug text-muted-foreground">
          {objective.load_bearing_note}
        </p>
      ) : null}
    </div>
  );
}