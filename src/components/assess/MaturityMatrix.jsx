import { MATURITY_AREAS, MATURITY_LEVELS } from "@/lib/assessContent";

export function MaturityMatrix({ value, onChange, disabled }) {
  return (
    <div className="space-y-3">
      {MATURITY_AREAS.map((area) => (
        <div key={area.key} className="rounded-2xl border border-border p-3">
          <p className="mb-2 text-[14px] font-semibold text-navy">{area.label}</p>
          <div className="grid grid-cols-4 gap-1.5">
            {MATURITY_LEVELS.map((level) => {
              const selected = value[area.key] === level;
              return (
                <button
                  key={level}
                  type="button"
                  disabled={disabled}
                  onClick={() => onChange(area.key, level)}
                  className={`min-h-[52px] rounded-xl px-1.5 py-2 text-[11px] font-semibold leading-tight transition ${
                    selected
                      ? "bg-gold text-navy shadow-sm"
                      : "bg-secondary/70 text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {level}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}