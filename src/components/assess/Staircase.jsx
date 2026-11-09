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
            className={`w-full rounded-2xl p-4 text-left transition ${
              selected ? "bg-gold text-gold-foreground" : "bg-background/40 text-foreground hover:bg-background/60"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2.5">
                <span
                  className={`grid h-8 w-8 place-items-center rounded-lg text-[15px] font-semibold ${
                    selected ? "bg-navy text-foreground" : "bg-card text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </span>
                <span className="font-heading text-[18px] font-semibold">{s.step}</span>
              </span>
              {selected ? <Check className="h-6 w-6" /> : null}
            </div>
            <p className={`mt-2 text-[15px] leading-snug ${selected ? "text-gold-foreground/90" : "text-muted-foreground"}`}>
              {s.description}
            </p>
            <p className={`mt-1.5 text-[15px] leading-snug ${selected ? "text-gold-foreground" : "text-foreground"}`}>
              Turning point: {s.turning_point}
            </p>
          </button>
        );
      })}
    </div>
  );
}