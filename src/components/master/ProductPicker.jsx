import { Check } from "lucide-react";
import { PRODUCT_GROUPS } from "@/lib/products";

export function ProductPicker({ value = [], onChange }) {
  const toggle = (key) => onChange(value.includes(key) ? value.filter((k) => k !== key) : [...value, key]);

  return (
    <div className="space-y-3">
      {PRODUCT_GROUPS.map((group) => (
        <div key={group.id}>
          <p className="mb-1.5 text-[14px] font-semibold text-gold">{group.name}</p>
          <div className="space-y-1.5">
            {group.items.map((p) => {
              const on = value.includes(p.key);
              const later = p.status === "later";
              return (
                <button
                  type="button"
                  key={p.key}
                  aria-pressed={on}
                  onClick={() => toggle(p.key)}
                  className={`flex w-full items-start gap-3 rounded-xl p-3 text-left transition ${
                    on ? "bg-gold text-gold-foreground" : "bg-background/40"
                  } ${later && !on ? "opacity-70" : ""}`}
                >
                  <span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md ${on ? "bg-navy/25" : "bg-card"}`}>
                    {on ? <Check className="h-4 w-4" /> : null}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[15px] font-semibold">
                      {p.name}
                      {later ? " · later" : ""}
                    </span>
                    {p.description ? (
                      <span className={`block text-[14px] ${on ? "" : "text-muted-foreground"}`}>{p.description}</span>
                    ) : null}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}