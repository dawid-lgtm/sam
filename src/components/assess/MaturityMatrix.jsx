import { MATURITY_AREAS, MATURITY_LEVELS } from "@/lib/assessContent";

export function MaturityMatrix({ value, onChange, disabled }) {
  return (
    <div className="space-y-3">
      {MATURITY_AREAS.map((area) => (
        <div key={area.key} className="rounded-2xl border border-border p-3">
          <p className="mb-2 text-[15px] font-semibold text-navy">{area.label}</p>
          <div className="space-y-1.5">
            {MATURITY_LEVELS.map((level, i) => {
              const selected = value[area.key] === level;
              return (
                <button
                  key={level}
                  type="button"
                  disabled={disabled}
                  onClick={() => onChange(area.key, level)}
                  className={`w-full min-h-[52px] rounded-xl px-3 py-2 text-left transition ${
                    selected ? "bg-gold text-navy shadow-sm" : "bg-secondary/70 text-navy hover:bg-secondary"
                  }`}
                >
                  <span className="block text-[11px] font-bold uppercase tracking-wide">
                    Level {i + 1} · {level}
                  </span>
                  <span className="block text-[13px] leading-snug">{area.cells[i]}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
