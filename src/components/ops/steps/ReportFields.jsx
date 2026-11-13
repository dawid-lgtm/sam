import { useEffect } from "react";
import { SHIFT_REPORT_SECTIONS } from "@/lib/opsContent";
import { inputClass } from "@/components/ui-kit/controls";

/** The Shift Report builds itself from the four block reports; the supervisor finishes the rest. */
export function ReportFields({ form, update, blocks = [], shift }) {
  const data = form.data || {};
  const setField = (key, value) => update({ data: { ...data, [key]: value } });

  useEffect(() => {
    if (data.__filled || !blocks.length) return;
    const byBlock = {};
    let target = 0;
    let mine = 0;
    let system = 0;
    blocks.forEach((b) => {
      byBlock[Number(b.block_no)] = b;
      target += Number(b.loads_target || 0);
      mine += Number(b.loads_mine || 0);
      system += Number(b.loads_system || 0);
    });
    const gap = mine - target;
    const delay = byBlock[2]?.data || {};
    update({
      data: {
        ...data,
        crew: data.crew || shift?.crew || "",
        pit_and_areas: data.pit_and_areas || shift?.pit_and_areas || "",
        target_loads: data.target_loads ?? (shift?.target_loads || target || ""),
        committed_loads: data.committed_loads ?? (shift?.committed_loads || ""),
        first_bucket: data.first_bucket || byBlock[1]?.data?.first_bucket || "",
        last_bucket: data.last_bucket || byBlock[4]?.data?.last_bucket || "",
        delays:
          data.delays ||
          (delay.top_delay_cause ? `${delay.top_delay_cause} · ${delay.top_delay_minutes || 0} min` : ""),
        got_away_with: data.got_away_with || byBlock[4]?.data?.got_away_with || "",
        gap: data.gap || (target || mine ? `${gap} loads versus target. Cause: ` : ""),
        __filled: true,
      },
    });
  }, [blocks.length]);

  return (
    <div className="space-y-3">
      <div className="rounded-xl bg-background/30 p-3">
        <p className="text-[15px] font-semibold text-foreground">By block</p>
        <p className="text-[14px] text-muted-foreground">Filled from your four block reports. Nothing retyped.</p>
        <div className="mt-2 space-y-1">
          {[1, 2, 3, 4].map((n) => {
            const b = blocks.find((r) => Number(r.block_no) === n);
            return (
              <div key={n} className="flex items-center justify-between gap-2 rounded-lg bg-background/50 px-2.5 py-2 text-[14px]">
                <span className="text-foreground">Block {n}</span>
                <span className="text-muted-foreground">
                  {b
                    ? `target ${b.loads_target ?? "–"} · mine ${b.loads_mine ?? "–"} · system ${b.loads_system ?? "–"}`
                    : "not submitted"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {SHIFT_REPORT_SECTIONS.map((section) => (
        <div key={section.id} className="rounded-xl bg-background/30 p-3">
          <p className="text-[15px] font-semibold text-foreground">{section.title}</p>
          {section.hint ? <p className="text-[14px] text-muted-foreground">{section.hint}</p> : null}
          <div className="mt-2 space-y-2">
            {section.fields.map((f) => (
              <div key={f.key}>
                <p className="text-[14px] font-medium text-foreground">{f.label}</p>
                {f.type === "textarea" ? (
                  <textarea rows={2} className={inputClass} value={data[f.key] || ""} onChange={(e) => setField(f.key, e.target.value)} />
                ) : f.type === "number" ? (
                  <input
                    type="number"
                    inputMode="decimal"
                    className={inputClass}
                    value={data[f.key] ?? ""}
                    onChange={(e) => setField(f.key, e.target.value === "" ? "" : Number(e.target.value))}
                  />
                ) : (
                  <input className={inputClass} value={data[f.key] || ""} onChange={(e) => setField(f.key, e.target.value)} />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}