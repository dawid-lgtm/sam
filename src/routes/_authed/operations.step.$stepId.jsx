import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import { useOps, fieldCoachUnlocked } from "@/lib/useOps";
import { linesFor } from "@/lib/opsContent";
import { nowMinutes, stepStatus, stepsFor } from "@/lib/opsShift";
import { buildPayload, hydrateStep, stepProblem } from "@/lib/opsForms";
import { marksToArray, validateMarks } from "@/lib/opsMarks";
import { saveStep, updateShift, uploadEvidence } from "@/lib/opsStore";
import { CardLines } from "@/components/ops/CardLines";
import { PhotoStrip } from "@/components/ops/PhotoStrip";
import { StepHeader } from "@/components/ops/StepHeader";
import { NumberPanel } from "@/components/ops/NumberPanel";
import { HandoverFields } from "@/components/ops/steps/HandoverFields";
import { PrestartFields } from "@/components/ops/steps/PrestartFields";
import { BlockFields } from "@/components/ops/steps/BlockFields";
import { ReportFields } from "@/components/ops/steps/ReportFields";

export const Route = createFileRoute("/_authed/operations/step/$stepId")({
  ssr: false,
  component: StepPage,
  head: () => ({ meta: [{ title: "Sam — Shift step" }] }),
});

const ENTITY = {
  handover: "HandoverRecord",
  handover_out: "HandoverRecord",
  prestart: "PrestartRecord",
  b1: "BlockReport",
  b2: "BlockReport",
  b3: "BlockReport",
  b4: "BlockReport",
  report: "ShiftReport",
};

function StepPage() {
  const { stepId } = Route.useParams();
  const navigate = useNavigate();
  const { user, data, isLoading, refresh } = useOps();
  const [form, setForm] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [skipOpen, setSkipOpen] = useState(false);
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (!data) return;
    setForm(hydrateStep(stepId, data.records?.[stepId]));
  }, [data, stepId]);

  if (isLoading || !data) return <div className="h-56 animate-pulse rounded-2xl bg-card" />;

  if (!fieldCoachUnlocked(data)) {
    return (
      <div className="sam-glass p-4">
        <p className="flex items-center gap-2 text-[16px] font-semibold text-foreground">
          <Lock className="h-5 w-5 text-gold" /> Locked until the Validation Lab
        </p>
        <p className="mt-1 text-[15px] text-muted-foreground">
          Prime comes first. The Field Coach opens when your facilitator marks the Lab complete.
        </p>
        <Link to="/operations/prime" className="mt-3 inline-flex min-h-[48px] items-center rounded-xl bg-gold px-4 text-[16px] font-semibold text-gold-foreground">
          Open Prime
        </Link>
      </div>
    );
  }

  const shift = data.shift;
  if (!shift) {
    return (
      <div className="sam-glass p-4">
        <p className="text-[16px] text-foreground">Start today's shift first.</p>
        <Link to="/operations" className="mt-3 inline-flex min-h-[48px] items-center rounded-xl bg-gold px-4 text-[16px] font-semibold text-gold-foreground">
          Back to Today
        </Link>
      </div>
    );
  }

  const steps = stepsFor(data.setting, shift.day_night);
  const step = steps.find((s) => s.id === stepId);
  if (!step) return <p className="text-[15px] text-muted-foreground">That step is not part of the day.</p>;

  const entity = ENTITY[stepId];
  const record = data.records?.[stepId];
  const blockNo = stepId.startsWith("b") ? Number(stepId.slice(1)) : null;
  const numbers = linesFor(stepId);
  const blockReports = new Map(
    [1, 2, 3, 4].map((n) => [n, data.records?.[`b${n}`]]).filter(([, r]) => r?.status === "Done"),
  );
  const update = (patch) => setForm((f) => ({ ...f, ...patch }));

  if (!form) return <div className="h-56 animate-pulse rounded-2xl bg-card" />;

  const problem = validateMarks(numbers, form.marks) || stepProblem(stepId, form, { blockReports });

  const savePhotos = async (file, lineNo) => {
    try {
      const evidence = await uploadEvidence(file);
      setForm((f) => ({
        ...f,
        photos: [...(f.photos || []), lineNo ? { ...evidence, line_no: String(lineNo) } : evidence],
      }));
    } catch {
      toast.error("Could not add the photo. It needs signal the first time.");
    }
  };

  const submit = async () => {
    if (problem) {
      setError(problem);
      return;
    }
    setBusy(true);
    setError("");
    try {
      await saveStep(user, record, { entity, shift }, buildPayload(stepId, form, blockNo));
      try {
        const patch = { steps: { ...(shift.steps || {}), [stepId]: "Done" } };
        if (stepId === "b1") {
          if (form.data?.committed_loads) {
            patch.committed_loads = Number(form.data.committed_loads);
            patch.committed_at = new Date().toISOString();
          }
          if (form.data?.loads_target) patch.target_loads = Number(form.data.loads_target);
        }
        if (stepId === "handover_out") patch.closed_at = new Date().toISOString();
        await updateShift(shift, patch);
      } catch {
        // The record is what matters; the shift header catches up when there is signal.
      }
      await refresh();
      toast.success("Submitted. Anything marked No keeps its action and date.");
      navigate({ to: "/operations" });
    } catch {
      toast.error("Saved on the phone. It will send when you have signal.");
    } finally {
      setBusy(false);
    }
  };

  const skip = async () => {
    if (!reason.trim()) {
      setError("Write why the step was skipped. The Superintendent sees it.");
      return;
    }
    setBusy(true);
    try {
      await saveStep(
        user,
        record,
        { entity, shift },
        { status: "Missed", skipped_reason: reason.trim(), marks: marksToArray(form.marks), photos: form.photos || [] },
      );
      try {
        await updateShift(shift, { steps: { ...(shift.steps || {}), [stepId]: "Missed" } });
      } catch {
        // Header catches up later.
      }
      await refresh();
      toast.success("Recorded as missed, with your reason.");
      navigate({ to: "/operations" });
    } catch {
      toast.error("Saved on the phone. It will send when you have signal.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-3">
      <StepHeader step={step} status={stepStatus(step, record, nowMinutes())} shift={shift} records={data.records} />

      {stepId === "prestart" ? (
        <div className="sam-glass p-3">
          <p className="text-[15px] font-semibold text-foreground">Tool 1 · Work out your number</p>
          <p className="text-[14px] text-muted-foreground">Before the pre-start. The handover does not commit it; the 09:00 Drive-around does.</p>
          <div className="mt-2">
            <NumberPanel user={user} shift={shift} record={data.numbers} onSaved={refresh} />
          </div>
        </div>
      ) : null}

      {stepId === "handover" || stepId === "handover_out" ? (
        <HandoverFields form={form} update={update} direction={stepId === "handover_out" ? "Out" : "In"} />
      ) : null}
      {stepId === "prestart" ? <PrestartFields form={form} update={update} /> : null}
      {blockNo ? <BlockFields blockNo={blockNo} form={form} update={update} shift={shift} /> : null}
      {stepId === "report" ? (
        <ReportFields form={form} update={update} blocks={data.blocks || []} shift={shift} />
      ) : null}

      <div className="sam-glass p-3">
        <p className="text-[15px] font-semibold text-foreground">Coaching card · lines {numbers[0]}–{numbers[numbers.length - 2]} plus +</p>
        <p className="text-[14px] text-muted-foreground">A No is the next thing to fix. It needs an action, an owner and a date.</p>
        <div className="mt-2">
          <CardLines numbers={numbers} marks={form.marks} onChange={(marks) => update({ marks })} onPhoto={savePhotos} photos={form.photos} />
        </div>
      </div>

      <div className="sam-glass p-3">
        <p className="text-[15px] font-semibold text-foreground">Evidence</p>
        <p className="text-[14px] text-muted-foreground">Photos are stored privately. Captions are optional.</p>
        <div className="mt-2">
          <PhotoStrip photos={form.photos || []} onChange={(photos) => update({ photos })} />
        </div>
      </div>

      {error ? <p className="rounded-xl bg-background/60 p-3 text-[15px] text-foreground">{error}</p> : null}

      <button
        type="button"
        onClick={submit}
        disabled={busy}
        className="min-h-[56px] w-full rounded-xl bg-gold px-4 text-[17px] font-semibold text-gold-foreground disabled:opacity-50"
      >
        {busy ? "Saving…" : record?.status === "Done" ? "Save changes" : "Submit"}
      </button>

      {skipOpen ? (
        <div className="sam-glass p-3">
          <p className="text-[15px] font-semibold text-foreground">Skip with a reason</p>
          <textarea
            rows={2}
            className="mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-3 text-[16px] text-foreground"
            placeholder="Radio call to an incident, no Superintendent on site…"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <div className="mt-2 flex gap-1.5">
            <button type="button" onClick={skip} disabled={busy} className="min-h-[48px] flex-1 rounded-xl bg-secondary px-3 text-[15px] font-semibold text-foreground disabled:opacity-50">
              Record as missed
            </button>
            <button type="button" onClick={() => setSkipOpen(false)} className="min-h-[48px] flex-1 rounded-xl bg-background/50 px-3 text-[15px] font-semibold text-muted-foreground">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => setSkipOpen(true)} className="min-h-[48px] w-full rounded-xl bg-secondary px-3 text-[15px] font-semibold text-foreground">
          Skip this step, with a reason
        </button>
      )}
    </div>
  );
}