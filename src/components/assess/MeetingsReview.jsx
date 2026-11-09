import { ACTION_OPTIONS } from "@/lib/assessContent";
import { inputClass } from "@/components/ui-kit/controls";

function Choice({ value, options, onChange }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map(({ value: v, label }) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className={`min-h-[44px] rounded-xl px-3 text-[15px] font-semibold transition ${
            value === v ? "bg-gold text-gold-foreground" : "bg-card text-foreground"
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
        <div key={i} className="rounded-xl bg-background/40 p-3.5">
          <p className="mb-2 text-[16px] font-semibold text-foreground">{row.meeting || `Meeting ${i + 1}`}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <input className={inputClass} value={row.where || ""} placeholder="Where"
              onChange={(e) => set(i, { where: e.target.value })} />
            <input className={inputClass} value={row.owner || ""} placeholder="Owner"
              onChange={(e) => set(i, { owner: e.target.value })} />
            <input className={inputClass} value={row.rhythm || ""} placeholder="How often and how long"
              onChange={(e) => set(i, { rhythm: e.target.value })} />
            <input className={inputClass} value={row.decides || ""} placeholder="What it decides"
              onChange={(e) => set(i, { decides: e.target.value })} />
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <div>
              <p className="mb-1 text-[15px] text-muted-foreground">IN or ON</p>
              <Choice
                value={row.in_or_on}
                onChange={(v) => set(i, { in_or_on: v })}
                options={[{ value: "IN", label: "IN" }, { value: "ON", label: "ON" }]}
              />
            </div>
            <div>
              <p className="mb-1 text-[15px] text-muted-foreground">Adds value</p>
              <Choice
                value={row.adds_value}
                onChange={(v) => set(i, { adds_value: v })}
                options={[{ value: "Y", label: "Yes" }, { value: "N", label: "No" }]}
              />
            </div>
            <div>
              <p className="mb-1 text-[15px] text-muted-foreground">Keep, change or stop</p>
              <Choice
                value={row.action}
                onChange={(v) => set(i, { action: v })}
                options={ACTION_OPTIONS.map((a) => ({ value: a, label: a }))}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}