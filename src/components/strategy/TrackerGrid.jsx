import { base44 } from "@/api/base44Client";
import { useRefreshSam } from "@/lib/useSamData";

const MONTHS = ["m1", "m2", "m3", "m4", "m5", "m6", "m7", "m8", "m9", "m10", "m11", "m12"];
const QUARTERS = ["q1", "q2", "q3", "q4"];

const tone = {
  Y: "bg-emerald-500 text-white",
  N: "bg-amber-400 text-navy",
  "": "bg-secondary text-muted-foreground/70",
};

export function TrackerGrid({ site, strategies, trackers, canEdit }) {
  const refresh = useRefreshSam();
  const rowFor = (code) => trackers.find((t) => t.strategy_code === code && t.site_id === site.id);

  const save = async (code, patch) => {
    const existing = rowFor(code);
    if (existing) {
      await base44.entities.StrategyTracker.update(existing.id, patch);
    } else {
      await base44.entities.StrategyTracker.create({
        strategy_code: code,
        site_id: site.id,
        site_name: site.name,
        ...patch,
        is_test: true,
      });
    }
    refresh();
  };

  const cycle = (code, key) => {
    if (!canEdit) return;
    const current = rowFor(code)?.[key] || "";
    const next = current === "" ? "Y" : current === "Y" ? "N" : "";
    save(code, { [key]: next });
  };

  return (
    <div className="space-y-3">
      {strategies.map((s) => {
        const row = rowFor(s.code) || {};
        return (
          <div key={s.code} className="rounded-2xl border border-border bg-white p-3.5">
            <div className="flex items-start gap-2.5">
              <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-navy text-[12px] font-bold text-white">
                {s.code}
              </span>
              <p className="text-[14px] font-semibold leading-snug text-navy">{s.statement}</p>
            </div>

            <div className="mt-3 flex flex-wrap gap-1">
              {MONTHS.map((key, i) => (
                <button
                  key={key}
                  type="button"
                  disabled={!canEdit}
                  onClick={() => cycle(s.code, key)}
                  aria-label={`Month ${i + 1}: ${row[key] || "blank"}`}
                  className={`h-8 w-8 rounded-md text-[11px] font-bold transition ${tone[row[key] || ""]}`}
                >
                  {row[key] === "Y" ? "Y" : row[key] === "N" ? "N" : i + 1}
                </button>
              ))}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {QUARTERS.map((q, i) => (
                <div key={q} className="rounded-xl bg-secondary/60 p-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Q{i + 1}
                  </p>
                  <div className="mt-1 space-y-1">
                    <input
                      type="number"
                      defaultValue={row[`${q}_volume`] ?? ""}
                      disabled={!canEdit}
                      onBlur={(e) => canEdit && save(s.code, { [`${q}_volume`]: Number(e.target.value) || 0 })}
                      placeholder="Volume"
                      className="w-full rounded-md border border-input bg-white px-2 py-1.5 text-[12px] text-navy focus:border-navy focus:outline-none"
                    />
                    <input
                      type="number"
                      defaultValue={row[`${q}_value`] ?? ""}
                      disabled={!canEdit}
                      onBlur={(e) => canEdit && save(s.code, { [`${q}_value`]: Number(e.target.value) || 0 })}
                      placeholder="$"
                      className="w-full rounded-md border border-input bg-white px-2 py-1.5 text-[12px] text-navy focus:border-navy focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}