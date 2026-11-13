import { Camera } from "lucide-react";
import { inputClass } from "@/components/ui-kit/controls";
import { lineText } from "@/lib/opsContent";

const choiceClass = (active, tone) => {
  const base = "min-h-[44px] rounded-lg px-3 text-[15px] font-semibold transition ";
  if (!active) return base + "bg-background/40 text-muted-foreground";
  if (tone === "yes") return base + "bg-gold text-gold-foreground";
  if (tone === "no") return base + "bg-foreground text-background";
  return base + "bg-secondary text-foreground";
};

export function CardLines({ numbers, marks = {}, onChange, onPhoto, photos = [], allowNa = true }) {
  const set = (no, patch) => onChange({ ...marks, [String(no)]: { ...(marks[String(no)] || {}), ...patch } });
  const choices = [
    { v: "Yes", label: "Yes", tone: "yes" },
    { v: "No", label: "No", tone: "no" },
    ...(allowNa ? [{ v: "NA", label: "Not available yet", tone: "na" }] : []),
  ];

  return (
    <div className="space-y-3">
      {numbers.map((no) => {
        const m = marks[String(no)] || {};
        const photoCount = photos.filter((p) => String(p.line_no) === String(no)).length;
        return (
          <div key={no} className="rounded-xl bg-background/30 p-3">
            <div className="flex items-start gap-2.5">
              <span className="mt-0.5 grid h-7 min-w-[28px] place-items-center rounded-md bg-background px-1 text-[14px] font-semibold text-gold">
                {no}
              </span>
              <p className="flex-1 text-[15px] leading-snug text-foreground">{lineText(no)}</p>
            </div>
            <div className={`mt-2 grid gap-1.5 ${allowNa ? "grid-cols-3" : "grid-cols-2"}`}>
              {choices.map((c) => (
                <button
                  key={c.v}
                  type="button"
                  onClick={() => set(no, { value: m.value === c.v ? "" : c.v })}
                  className={choiceClass(m.value === c.v, c.tone)}
                >
                  <span className="text-[14px] leading-tight">{c.label}</span>
                </button>
              ))}
            </div>

            {m.value === "No" ? (
              <div className="mt-2 space-y-2 rounded-lg bg-background/50 p-2.5">
                <p className="text-[13px] text-muted-foreground">A No needs an action, an owner and a date.</p>
                <input className={inputClass + " mt-0"} placeholder="Action" value={m.action || ""} onChange={(e) => set(no, { action: e.target.value })} />
                <div className="grid grid-cols-2 gap-2">
                  <input className={inputClass + " mt-0"} placeholder="Owner" value={m.owner || ""} onChange={(e) => set(no, { owner: e.target.value })} />
                  <input className={inputClass + " mt-0"} type="date" value={m.by_date || ""} onChange={(e) => set(no, { by_date: e.target.value })} />
                </div>
              </div>
            ) : null}

            {m.value === "NA" ? (
              <input
                className={inputClass + " mt-2"}
                placeholder="Short reason it is not available at my site"
                value={m.note || ""}
                onChange={(e) => set(no, { note: e.target.value })}
              />
            ) : null}

            {onPhoto ? (
              <label className="mt-2 inline-flex min-h-[40px] cursor-pointer items-center gap-1.5 rounded-lg bg-secondary px-3 text-[14px] font-medium text-foreground">
                <Camera className="h-4 w-4" />
                Photo{photoCount ? ` (${photoCount})` : ""}
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    e.target.value = "";
                    if (file) onPhoto(file, no);
                  }}
                />
              </label>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}