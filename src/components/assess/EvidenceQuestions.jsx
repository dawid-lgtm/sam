import { inputClass } from "@/components/ui-kit/controls";

export function EvidenceQuestions({ answers, onChange }) {
  const set = (i, patch) => onChange(answers.map((a, idx) => (idx === i ? { ...a, ...patch } : a)));

  return (
    <div className="space-y-3">
      {answers.map((item, i) => (
        <div key={i} className="rounded-2xl border border-border p-3">
          <p className="text-[14px] font-medium leading-snug text-navy">{item.question}</p>
          <div className="mt-2 flex gap-1.5">
            {["Y", "N"].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => set(i, { answer: v })}
                className={`min-h-[44px] min-w-[56px] rounded-lg text-[14px] font-semibold transition ${
                  item.answer === v ? "bg-navy text-white" : "bg-secondary text-muted-foreground"
                }`}
              >
                {v}
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