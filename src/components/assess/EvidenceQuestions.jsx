import { inputClass } from "@/components/ui-kit/controls";

export function EvidenceQuestions({ answers, onChange }) {
  const set = (i, patch) => onChange(answers.map((a, idx) => (idx === i ? { ...a, ...patch } : a)));

  return (
    <div className="space-y-3">
      {answers.map((item, i) => (
        <div key={i} className="rounded-xl bg-background/40 p-3.5">
          <p className="text-[16px] font-medium leading-snug text-foreground">{item.question}</p>
          <div className="mt-2 flex gap-1.5">
            {[{ v: "Y", label: "Yes" }, { v: "N", label: "No" }].map(({ v, label }) => (
              <button
                key={v}
                type="button"
                onClick={() => set(i, { answer: v })}
                className={`min-h-[44px] min-w-[72px] rounded-xl text-[15px] font-semibold transition ${
                  item.answer === v ? "bg-gold text-gold-foreground" : "bg-card text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <input
            className={inputClass}
            placeholder="The evidence"
            value={item.evidence || ""}
            onChange={(e) => set(i, { evidence: e.target.value })}
          />
        </div>
      ))}
    </div>
  );
}