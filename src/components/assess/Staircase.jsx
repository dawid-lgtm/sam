import { STAIRCASE } from "@/lib/assessContent";
import { Check } from "lucide-react";

export function Staircase({ value, onChange, disabled }) {
  return (
    <div className="space-y-2.5">
      {STAIRCASE.map((s, i) => {
        const selected = value === s.step;
        return (
          <button
            key={s.step}
            type="button"
            disabled={disabled}
            onClick={() => onChange(s.step)}
            className={`w-full rounded-2xl border p-4 text-left transition ${
              selected ? "border-navy bg-navy text-white" : "border-border bg-white hover:border-navy/30"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2.5">
                <span
                  className={`grid h-7 w-7 place-items-center rounded-lg text-xs font-bold ${
                    selected ? "bg-gold text-navy" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </span>
                <span className="text-[16px] font-semibold">{s.step}</span>
              </span>
              {selected ? <Check className="h-5 w-5 text-gold" /> : null}
            </div>
            <p className={`mt-2 text-sm leading-snug ${selected ? "text-white/85" : "text-muted-foreground"}`}>
              {s.description}
            </p>
            <p className={`mt-1.5 text-xs leading-snug ${selected ? "text-gold" : "text-[#7a6114]"}`}>
              Turning point: {s.turning_point}
            </p>
          </button>
        );
      })}
    </div>
  );
}