import { ACTION_OPTIONS } from "@/lib/assessContent";
import { inputClass } from "@/components/ui-kit/controls";

function YesNo({ value, onChange, labels = ["Y", "N"] }) {
  return (
    <div className="flex gap-1.5">
      {labels.map((label) => (
        <button
          key={label}
          type="button"
          onClick={() => onChange(label)}
          className={`min-h-[40px] min-w-[44px] rounded-lg px-2 text-[13px] font-semibold transition ${
            value === label ? "bg-navy text-white" : "bg-secondary text-muted-foreground"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export function MeetingsReview({ rows, onChange }) {
  const set = (i, patch) => onChange(rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));

  return (
    <div className="space-y-3">
      {rows.map((row, i) => (
        <div key={i} className="rounded-2xl border border-border p-3">
          <p className="mb-2 text-[14px] font-semibold text-navy">{row.meeting || `Meeting ${i + 1}`}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <input className={inputClass} value={row.where || ""} placeholder="Where"
              onChange={(e) => set(i, { where: e.target.value })} />
            <input className={inputClass} value={row.owner || ""} placeholder="Owner"
              onChange={(e) => set(i, { owner: e.target.value })} />
            <input className={inputClass} value={row.rhythm || ""} placeholder="How often / how long"
              onChange={(e) => set(i, { rhythm: e.target.value })} />
            <input className={inputClass} value={row.decides || ""} placeholder="What it decides"
              onChange={(e) => set(i, { decides: e.target.value })} />
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-4">
            <div>
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">IN or ON</p>
              <YesNo value={row.in_or_on} onChange={(v) => set(i, { in_or_on: v })} labels={["IN", "ON"]} />
            </div>
            <div>
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Adds value</p>
              <YesNo value={row.adds_value} onChange={(v) => set(i, { adds_value: v })} />
            </div>
            <div>
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Keep / change / stop</p>
              <div className="flex gap-1.5">
                {ACTION_OPTIONS.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => set(i, { action: a })}
                    className={`min-h-[40px] rounded-lg px-2.5 text-[12px] font-semibold transition ${
                      row.action === a ? "bg-navy text-white" : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}