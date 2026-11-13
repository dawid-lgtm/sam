import { BLOCK_CHECKLISTS, BLOCK_FIELDS, LOAD_FIELDS, MEETINGS } from "@/lib/opsContent";
import { Checklist } from "@/components/ops/Checklist";
import { Stopwatch } from "@/components/ops/Stopwatch";
import { inputClass } from "@/components/ui-kit/controls";

const numberInput = (value, onChange) => (
  <input
    type="number"
    inputMode="decimal"
    className={inputClass + " mt-0"}
    value={value ?? ""}
    onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
  />
);

export function BlockFields({ blockNo, form, update, shift }) {
  const data = form.data || {};
  const setField = (key, value) => update({ data: { ...data, [key]: value } });
  const meeting = MEETINGS[`b${blockNo}`] || {};
  const counts = form.operator_counts || [];

  const setCount = (i, patch) =>
    update({ operator_counts: counts.map((row, idx) => (idx === i ? { ...row, ...patch } : row)) });
  const totalLoads = counts.reduce((sum, row) => sum + Number(row.loads || 0), 0);

  return (
    <div className="space-y-3">
      <div className="rounded-xl bg-background/30 p-3">
        <p className="text-[15px] font-semibold text-foreground">Check in this block</p>
        <div className="mt-2">
          <Checklist items={BLOCK_CHECKLISTS[blockNo]} value={form.checklist} onChange={(v) => update({ checklist: v })} />
        </div>
      </div>

      <div className="rounded-xl bg-background/30 p-3">
        <p className="text-[15px] font-semibold text-foreground">Loads</p>
        <div className="mt-2 grid grid-cols-3 gap-1.5">
          {LOAD_FIELDS.map((f) => (
            <label key={f.key} className="block">
              <span className="text-[13px] text-muted-foreground">{f.label}</span>
              {numberInput(data[f.key], (v) => setField(f.key, v))}
            </label>
          ))}
        </div>
        <p className="mt-2 text-[14px] text-muted-foreground">
          Variance:{" "}
          {data.loads_mine != null && data.loads_target != null
            ? `${data.loads_mine - data.loads_target} loads`
            : "add your figure and the target"}
        </p>
      </div>

      <div className="rounded-xl bg-background/30 p-3">
        <p className="text-[15px] font-semibold text-foreground">What this block records</p>
        <div className="mt-2 space-y-2.5">
          {BLOCK_FIELDS[blockNo].map((f) => (
            <div key={f.key}>
              <p className="text-[14px] font-medium text-foreground">{f.label}</p>
              {f.type === "textarea" ? (
                <textarea rows={2} className={inputClass} value={data[f.key] || ""} onChange={(e) => setField(f.key, e.target.value)} />
              ) : f.type === "stopwatch" ? (
                <div className="mt-1 space-y-2">
                  <Stopwatch laps={data.laps || []} onChange={(laps) => setField("laps", laps)} />
                  <p className="text-[13px] text-muted-foreground">
                    Write each truck below: hang, queue, load and cycle. Target: {shift?.target_loads ? "from your number" : "set on the day"}.
                  </p>
                  <div className="space-y-1.5">
                    {[0, 1, 2].map((i) => {
                      const rows = data.trucks || [];
                      const row = rows[i] || {};
                      const setRow = (patch) => {
                        const next = [...rows];
                        next[i] = { ...row, ...patch };
                        setField("trucks", next);
                      };
                      return (
                        <div key={i} className="grid grid-cols-4 gap-1">
                          {[
                            { k: "hang", p: "Hang (s)" },
                            { k: "queue", p: "Queue (s)" },
                            { k: "load", p: "Load (s)" },
                            { k: "cycle", p: "Cycle (min)" },
                          ].map((cell) => (
                            <input
                              key={cell.k}
                              type="number"
                              inputMode="decimal"
                              className={inputClass + " mt-0 px-2 py-2 text-[14px]"}
                              placeholder={cell.p}
                              value={row[cell.k] ?? ""}
                              onChange={(e) => setRow({ [cell.k]: e.target.value === "" ? "" : Number(e.target.value) })}
                            />
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : f.type === "number" ? (
                numberInput(data[f.key], (v) => setField(f.key, v))
              ) : (
                <input
                  type={f.type === "time" ? "time" : "text"}
                  className={inputClass}
                  value={data[f.key] || ""}
                  onChange={(e) => setField(f.key, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-background/30 p-3">
        <p className="text-[15px] font-semibold text-foreground">Tool 2 · Operator counts</p>
        <p className="text-[14px] text-muted-foreground">One row per operator. Your figure is the total.</p>
        <div className="mt-2 space-y-2">
          {counts.map((row, i) => (
            <div key={i} className="rounded-lg bg-background/50 p-2">
              <input
                className={inputClass + " mt-0"}
                placeholder="Operator"
                value={row.operator || ""}
                onChange={(e) => setCount(i, { operator: e.target.value })}
              />
              <div className="mt-1 grid grid-cols-3 gap-1">
                <input className={inputClass + " mt-0"} placeholder="Machine" value={row.machine || ""} onChange={(e) => setCount(i, { machine: e.target.value })} />
                <input type="number" inputMode="decimal" className={inputClass + " mt-0"} placeholder="Loads" value={row.loads ?? ""} onChange={(e) => setCount(i, { loads: e.target.value === "" ? "" : Number(e.target.value) })} />
                <input type="number" inputMode="decimal" className={inputClass + " mt-0"} placeholder="Buckets" value={row.buckets ?? ""} onChange={(e) => setCount(i, { buckets: e.target.value === "" ? "" : Number(e.target.value) })} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => update({ operator_counts: [...counts, { operator: "", machine: "", loads: "", buckets: "" }] })}
            className="min-h-[44px] rounded-xl bg-secondary px-3 text-[14px] font-semibold text-foreground"
          >
            Add operator
          </button>
          {totalLoads ? (
            <button
              type="button"
              onClick={() => setField("loads_mine", totalLoads)}
              className="min-h-[44px] rounded-xl bg-gold px-3 text-[14px] font-semibold text-gold-foreground"
            >
              Use {totalLoads} as my figure
            </button>
          ) : null}
        </div>
      </div>

      {meeting.name ? (
        <div className="rounded-xl bg-background/30 p-3">
          <p className="text-[15px] font-semibold text-foreground">
            {meeting.name} {meeting.time}
          </p>
          <p className="text-[14px] text-muted-foreground">{meeting.asks}</p>
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => update({ meeting_held: !form.meeting_held, meeting_not_available: false })}
              className={`min-h-[44px] rounded-lg px-2 text-[14px] font-semibold ${
                form.meeting_held ? "bg-gold text-gold-foreground" : "bg-background/50 text-foreground"
              }`}
            >
              Held
            </button>
            <button
              type="button"
              onClick={() => update({ meeting_not_available: !form.meeting_not_available, meeting_held: false })}
              className={`min-h-[44px] rounded-lg px-2 text-[14px] font-semibold ${
                form.meeting_not_available ? "bg-gold text-gold-foreground" : "bg-background/50 text-foreground"
              }`}
            >
              Superintendent not available
            </button>
          </div>
          {form.meeting_held ? (
            <>
              <input type="time" className={inputClass} value={form.meeting_time || ""} onChange={(e) => update({ meeting_time: e.target.value })} />
              <textarea
                rows={2}
                className={inputClass}
                placeholder="The decision taken"
                value={form.meeting_decision || ""}
                onChange={(e) => update({ meeting_decision: e.target.value })}
              />
            </>
          ) : null}
          {form.meeting_not_available ? (
            <p className="mt-1 text-[14px] text-muted-foreground">
              Do the step, write it down, and take it to them at the next meeting.
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}