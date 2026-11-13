import { Check } from "lucide-react";
import { inputClass } from "@/components/ui-kit/controls";

export function arrayToChecklist(items, value) {
  const out = {};
  (items || []).forEach((item) => {
    const found = (value || []).find((v) => v.id === item.id);
    out[item.id] = { done: !!found?.done, note: found?.note || "" };
  });
  return out;
}

export function checklistToArray(items, value) {
  return (items || []).map((item) => ({
    id: item.id,
    done: !!value?.[item.id]?.done,
    note: value?.[item.id]?.note || "",
  }));
}

export function Checklist({ items = [], value = {}, onChange }) {
  const set = (id, patch) =>
    onChange({ ...value, [id]: { ...(value[id] || { done: false, note: "" }), ...patch } });

  return (
    <div className="space-y-2">
      {items.map((item) => {
        const row = value[item.id] || {};
        return (
          <div key={item.id} className="rounded-xl bg-background/30 p-3">
            <button
              type="button"
              onClick={() => set(item.id, { done: !row.done })}
              className="flex w-full items-start gap-3 text-left"
            >
              <span
                className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-md border-2 ${
                  row.done ? "border-gold bg-gold text-gold-foreground" : "border-foreground/40 text-transparent"
                }`}
              >
                <Check className="h-4 w-4" strokeWidth={3} />
              </span>
              <span className={`flex-1 text-[15px] leading-snug ${row.done ? "text-muted-foreground" : "text-foreground"}`}>
                {item.text}
              </span>
            </button>
            {row.done ? (
              <input
                className={inputClass}
                placeholder="Note (optional)"
                value={row.note || ""}
                onChange={(e) => set(item.id, { note: e.target.value })}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}