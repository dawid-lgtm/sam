import { saveOffline } from "@/lib/offline";
import { useRefreshSam } from "@/lib/useSamData";
import { withWords } from "@/lib/labels";

const MONTHS = ["m1", "m2", "m3", "m4", "m5", "m6", "m7", "m8", "m9", "m10", "m11", "m12"];
const QUARTERS = ["q1", "q2", "q3", "q4"];

function cellClass(state) {
  if (state === "Y") return "bg-gold text-gold-foreground";
  if (state === "N") return "border-2 border-foreground text-foreground";
  return "bg-background/50 text-muted-foreground";
}

export function TrackerGrid({ site, strategies, trackers, canEdit }) {
  const refresh = useRefreshSam();
  const rowFor = (code) => trackers.find((t) => t.strategy_code === code && t.site_id === site.id);

  const save = async (code, patch) => {
    const existing = rowFor(code);
    if (existing) {
      await saveOffline("StrategyTracker", "update", { id: existing.id, data: patch });
    } else {
      await saveOffline("StrategyTracker", "create", {
        data: {
          strategy_code: code,
          site_id: site.id,
          site_name: site.name,
          ...patch,
          is_test: true,
        },
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
          <div key={s.code} className="rounded-xl bg-background/40 p-3.5">
            <div className="flex items-start gap-2.5">
              <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gold text-[15px] font-semibold text-gold-foreground">
                {s.code}
              </span>
              <p className="text-[15px] font-medium leading-snug text-foreground">{withWords(s.code, s.statement, 9)}</p>
            </div>

            <div className="mt-3 grid grid-cols-4 gap-1.5 sm:grid-cols-6 lg:grid-cols-12">
              {MONTHS.map((key, i) => {
                const state = row[key] || "";
                return (
                  <button
                    key={key}
                    type="button"
                    disabled={!canEdit}
                    onClick={() => cycle(s.code, key)}
                    aria-label={`Month ${i + 1}: ${state === "Y" ? "yes" : state === "N" ? "no" : "empty"}`}
                    className={`min-h-[48px] rounded-lg text-[15px] font-semibold transition ${cellClass(state)}`}
                  >
                    {state === "Y" ? "Yes" : state === "N" ? "No" : i + 1}
                  </button>
                );
              })}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {QUARTERS.map((q, i) => (
                <div key={q} className="rounded-lg bg-background/60 p-2">
                  <p className="text-[15px] font-semibold text-foreground">Q{i + 1}</p>
                  <div className="mt-1 space-y-1">
                    <input
                      type="number"
                      defaultValue={row[`${q}_volume`] ?? ""}
                      disabled={!canEdit}
                      onBlur={(e) => canEdit && save(s.code, { [`${q}_volume`]: Number(e.target.value) || 0 })}
                      placeholder="Volume"
                      className="w-full rounded-md bg-background px-2 py-2 text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50"
                    />
                    <input
                      type="number"
                      defaultValue={row[`${q}_value`] ?? ""}
                      disabled={!canEdit}
                      onBlur={(e) => canEdit && save(s.code, { [`${q}_value`]: Number(e.target.value) || 0 })}
                      placeholder="Dollars"
                      className="w-full rounded-md bg-background px-2 py-2 text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50"
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