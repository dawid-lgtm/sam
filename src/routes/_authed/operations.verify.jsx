import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { CARD_LINES } from "@/lib/opsContent";
import { validateMarks } from "@/lib/opsMarks";
import { CardLines } from "@/components/ops/CardLines";
import { inputClass } from "@/components/ui-kit/controls";

export const Route = createFileRoute("/_authed/operations/verify")({
  ssr: false,
  component: VerifyPage,
  head: () => ({ meta: [{ title: "Sam — Verify" }] }),
});

const ALL_LINES = CARD_LINES.map((l) => l.no);

function VerifyPage() {
  const { user } = useAuth();
  const [enrolmentId, setEnrolmentId] = useState("");
  const [marks, setMarks] = useState({});
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState("Signed off");
  const [workOn, setWorkOn] = useState("");
  const [busy, setBusy] = useState(false);

  const enrolments = useQuery({
    queryKey: ["ops-enrolments-all"],
    queryFn: () => base44.entities.OpsEnrolment.list(),
  });
  const enrolment = (enrolments.data || []).find((e) => e.id === enrolmentId);

  const sign = async () => {
    const problem = validateMarks(ALL_LINES, marks, { allowNa: false });
    if (problem) {
      toast.error(problem);
      return;
    }
    if (!enrolment) {
      toast.error("Choose who you are observing.");
      return;
    }
    setBusy(true);
    try {
      await base44.entities.VerifyObservation.create({
        enrolment_id: enrolment.id,
        user_id: enrolment.user_id,
        observer_id: user?.id || "",
        observer_name: user?.full_name || user?.email || "",
        observation_date: new Date().toISOString().slice(0, 10),
        marks: Object.entries(marks).map(([line_no, m]) => ({ line_no, value: m.value, note: m.note || "" })),
        notes,
        result,
        lines_to_work_on: workOn ? workOn.split(",").map((s) => s.trim()).filter(Boolean) : [],
        signed_at: new Date().toISOString(),
      });
      await base44.entities.OpsEnrolment.update(enrolment.id, {
        verify_result: result,
        stage: result === "Signed off" ? "Complete" : "Verify",
      });
      toast.success(result === "Signed off" ? "Verify signed off." : "Verify marked for a repeat.");
      setMarks({});
      setNotes("");
      setWorkOn("");
    } catch {
      toast.error("Could not save the observation.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-3">
      <Link to="/operations" className="text-[15px] text-muted-foreground">
        ← Operations
      </Link>
      <div>
        <h1 className="font-heading text-[26px] font-semibold leading-tight text-foreground">Verify</h1>
        <p className="text-[15px] text-muted-foreground">
          One shift observed, Yes or No against the cards. No threshold: you decide and sign.
        </p>
      </div>

      <div className="sam-glass p-3">
        <p className="text-[15px] font-semibold text-foreground">Who are you observing?</p>
        <select className={inputClass} value={enrolmentId} onChange={(e) => setEnrolmentId(e.target.value)}>
          <option value="">Choose a supervisor…</option>
          {(enrolments.data || []).map((e) => (
            <option key={e.id} value={e.id}>
              {e.user_name || e.user_id} · {e.stage}
            </option>
          ))}
        </select>
      </div>

      {enrolmentId ? (
        <>
          <div className="sam-glass p-3">
            <p className="text-[15px] font-semibold text-foreground">The cards, line by line</p>
            <p className="text-[14px] text-muted-foreground">Mark what you saw. Compare with their own marks afterwards.</p>
            <div className="mt-2">
              <CardLines numbers={ALL_LINES} marks={marks} onChange={setMarks} allowNa={false} />
            </div>
          </div>

          <div className="sam-glass p-3">
            <p className="text-[15px] font-semibold text-foreground">Notes</p>
            <textarea rows={3} className={inputClass} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>

          <div className="sam-glass p-3">
            <p className="text-[15px] font-semibold text-foreground">Result</p>
            <div className="mt-1.5 grid grid-cols-2 gap-1.5">
              {["Signed off", "Repeat"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setResult(r)}
                  className={`min-h-[48px] rounded-xl px-2 text-[15px] font-semibold ${
                    result === r ? "bg-gold text-gold-foreground" : "bg-background/50 text-foreground"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            {result === "Repeat" ? (
              <input
                className={inputClass}
                placeholder="Lines to work on, by number (e.g. 27, 30, 38)"
                value={workOn}
                onChange={(e) => setWorkOn(e.target.value)}
              />
            ) : null}
          </div>

          <button type="button" onClick={sign} disabled={busy} className="min-h-[56px] w-full rounded-xl bg-gold px-4 text-[17px] font-semibold text-gold-foreground disabled:opacity-50">
            {busy ? "Signing…" : "Sign and record the observation"}
          </button>
        </>
      ) : null}
    </div>
  );
}