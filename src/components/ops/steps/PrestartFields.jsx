import { useState } from "react";
import { PRESTART_AGENDA } from "@/lib/opsContent";
import { inputClass } from "@/components/ui-kit/controls";

export function PrestartFields({ form, update }) {
  const [name, setName] = useState("");
  const said = form.said_back || [];

  const addOperator = () => {
    if (!name.trim()) return;
    update({ said_back: [...said, { name: name.trim(), ok: false, fixed: false }] });
    setName("");
  };
  const setOperator = (i, patch) =>
    update({ said_back: said.map((row, idx) => (idx === i ? { ...row, ...patch } : row)) });

  return (
    <div className="space-y-3">
      <div className="rounded-xl bg-background/30 p-3">
        <p className="text-[15px] font-semibold text-foreground">The 15 minutes</p>
        <ul className="mt-1 space-y-0.5">
          {PRESTART_AGENDA.map((item) => (
            <li key={item.item} className="text-[14px] text-muted-foreground">
              {item.min} min · {item.item}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl bg-background/30 p-3">
        <p className="text-[15px] font-semibold text-foreground">Fit to start, area by area</p>
        <p className="text-[14px] text-muted-foreground">People, machines, conditions — or work does not start.</p>
        <textarea
          rows={3}
          className={inputClass}
          value={form.fit_to_start || ""}
          onChange={(e) => update({ fit_to_start: e.target.value })}
          placeholder="Each area, and fit or not fit, with what is missing"
        />
      </div>

      <div className="rounded-xl bg-background/30 p-3">
        <p className="text-[15px] font-semibold text-foreground">Anything the crew raised that changes the plan</p>
        <textarea
          rows={2}
          className={inputClass}
          value={form.changes_to_plan || ""}
          onChange={(e) => update({ changes_to_plan: e.target.value })}
        />
      </div>

      <div className="rounded-xl bg-background/30 p-3">
        <p className="text-[15px] font-semibold text-foreground">What did we get away with yesterday?</p>
        <p className="text-[14px] text-muted-foreground">Required. It feeds the safety trend.</p>
        <textarea
          rows={3}
          className={inputClass}
          value={form.got_away_with || ""}
          onChange={(e) => update({ got_away_with: e.target.value })}
        />
      </div>

      <div className="rounded-xl bg-background/30 p-3">
        <p className="text-[15px] font-semibold text-foreground">Said back by name</p>
        <p className="text-[14px] text-muted-foreground">
          First and last bucket, targets, contingencies, priority areas and the risks to the numbers.
        </p>
        <div className="mt-2 space-y-2">
          {said.map((row, i) => (
            <div key={i} className="rounded-lg bg-background/50 p-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[15px] text-foreground">{row.name}</span>
                <button
                  type="button"
                  onClick={() => setOperator(i, { ok: !row.ok })}
                  className={`min-h-[40px] rounded-lg px-3 text-[14px] font-semibold ${
                    row.ok ? "bg-gold text-gold-foreground" : "bg-secondary text-foreground"
                  }`}
                >
                  {row.ok ? "Said back" : "Not yet"}
                </button>
              </div>
              {!row.ok ? (
                <button
                  type="button"
                  onClick={() => setOperator(i, { fixed: !row.fixed })}
                  className={`mt-1.5 min-h-[40px] w-full rounded-lg px-3 text-left text-[14px] ${
                    row.fixed ? "bg-gold text-gold-foreground" : "bg-secondary text-foreground"
                  }`}
                >
                  {row.fixed ? "Fixed before they left the room" : "Fixed before they left the room?"}
                </button>
              ) : null}
            </div>
          ))}
        </div>
        <div className="mt-2 flex gap-1.5">
          <input
            className={inputClass + " mt-0"}
            placeholder="Operator name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="button" onClick={addOperator} className="min-h-[48px] rounded-xl bg-secondary px-4 text-[15px] font-semibold text-foreground">
            Add
          </button>
        </div>
      </div>

      <div className="rounded-xl bg-background/30 p-3">
        <p className="text-[15px] font-semibold text-foreground">Tool 3 · Operator scorecard</p>
        <button
          type="button"
          onClick={() => update({ scorecard_current: !form.scorecard_current })}
          className={`mt-1 min-h-[48px] w-full rounded-xl px-3 text-left text-[15px] ${
            form.scorecard_current ? "bg-gold text-gold-foreground" : "bg-background/50 text-foreground"
          }`}
        >
          {form.scorecard_current ? "Scorecard is up to date" : "Confirm the scorecard is up to date"}
        </button>
        <p className="mt-2 text-[14px] text-muted-foreground">Top performers named and congratulated this roster, on:</p>
        <input
          type="date"
          className={inputClass}
          value={form.scorecard_named_date || ""}
          onChange={(e) => update({ scorecard_named_date: e.target.value })}
        />
      </div>
    </div>
  );
}