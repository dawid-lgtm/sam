import { HANDOVER_DECISIONS, HANDOVER_SETUP_ITEMS, PAVA_ROWS } from "@/lib/opsContent";
import { inputClass } from "@/components/ui-kit/controls";

export function HandoverFields({ form, update, direction }) {
  const pava = (key, field, value) =>
    update({ pava: { ...form.pava, [key]: { ...(form.pava?.[key] || {}), [field]: value } } });
  const setup = (key, field, value) =>
    update({ setup: { ...form.setup, [key]: { ...(form.setup?.[key] || {}), [field]: value } } });

  return (
    <div className="space-y-3">
      <div className="rounded-xl bg-background/30 p-3">
        <p className="text-[15px] font-semibold text-foreground">
          {direction === "Out" ? "The sheet the oncoming supervisor will see" : "Tool 4 · Handover sheet"}
        </p>
        <p className="text-[14px] text-muted-foreground">Last shift in PAVA. Plan, actual, variance and impact, action taken.</p>
        <div className="mt-2 space-y-3">
          {PAVA_ROWS.map((row) => (
            <div key={row.key}>
              <p className="text-[15px] font-medium text-foreground">{row.label}</p>
              <div className="mt-1 grid grid-cols-2 gap-1.5">
                {[
                  { f: "plan", label: "Plan" },
                  { f: "actual", label: "Actual" },
                  { f: "variance", label: "Variance and impact" },
                  { f: "action", label: "Action taken" },
                ].map((cell) => (
                  <input
                    key={cell.f}
                    className={inputClass + " mt-0"}
                    placeholder={cell.label}
                    value={form.pava?.[row.key]?.[cell.f] || ""}
                    onChange={(e) => pava(row.key, cell.f, e.target.value)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-background/30 p-3">
        <p className="text-[15px] font-semibold text-foreground">Set up, and to set up</p>
        <p className="text-[14px] text-muted-foreground">A job to set up, or a risk, without a name is not handed over.</p>
        <div className="mt-2 space-y-3">
          {HANDOVER_SETUP_ITEMS.map((item) => (
            <div key={item.key}>
              <p className="text-[14px] font-medium text-foreground">{item.label}</p>
              <input
                className={inputClass + " mt-1"}
                placeholder="What, and where"
                value={form.setup?.[item.key]?.what || ""}
                onChange={(e) => setup(item.key, "what", e.target.value)}
              />
              <input
                className={inputClass}
                placeholder="Where"
                value={form.setup?.[item.key]?.where || ""}
                onChange={(e) => setup(item.key, "where", e.target.value)}
              />
              <input
                className={inputClass}
                placeholder="Name against it"
                value={form.setup?.[item.key]?.name || ""}
                onChange={(e) => setup(item.key, "name", e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-background/30 p-3">
        <p className="text-[15px] font-semibold text-foreground">The decisions</p>
        <div className="mt-2 space-y-1.5">
          {HANDOVER_DECISIONS.map((label, i) => (
            <button
              key={label}
              type="button"
              onClick={() => update({ decisions: { ...form.decisions, [i]: !form.decisions?.[i] } })}
              className={`flex min-h-[48px] w-full items-center gap-3 rounded-xl px-3 text-left text-[15px] ${
                form.decisions?.[i] ? "bg-gold text-gold-foreground" : "bg-background/50 text-foreground"
              }`}
            >
              <span className="text-[15px] font-semibold">{form.decisions?.[i] ? "✓" : "○"}</span>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-background/30 p-3">
        <p className="text-[15px] font-medium text-foreground">Other supervisor</p>
        <input
          className={inputClass}
          placeholder="Name of the supervisor you are handing over with"
          value={form.counterpart_name || ""}
          onChange={(e) => update({ counterpart_name: e.target.value })}
        />
      </div>
    </div>
  );
}