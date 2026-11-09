import { MATURITY_AREAS, MATURITY_LEVELS } from "@/lib/assessContent";

export function MaturityMatrix({ value, onChange, disabled }) {
  return (
    <div className="space-y-4">
      {MATURITY_AREAS.map((area) => (
        <div key={area.key}>
          <p className="mb-2 text-[16px] font-semibold text-foreground">{area.label}</p>
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
                    selected
                      ? "bg-gold text-gold-foreground"
                      : "bg-background/40 text-foreground hover:bg-background/60"
                  }`}
                >
                  <span className={`block text-[15px] font-semibold ${selected ? "" : "text-muted-foreground"}`}>
                    Level {i + 1}: {level}
                  </span>
                  <span className="block text-[15px] leading-snug">{area.cells[i]}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}