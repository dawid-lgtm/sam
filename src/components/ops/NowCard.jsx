import { Clock, ChevronRight } from "lucide-react";
import { BLOCKS } from "@/lib/opsContent";

const STEP_FOCUS = {
  handover: "Read last shift's report and handover sheet, then run the 30-minute handover.",
  prestart: "Fit to start, area by area, and every operator says it back by name.",
  report: "The report fills itself from your blocks. Finish the close-out and sign it.",
  handover_out: "Set the next crew up, then hand over to the oncoming supervisor.",
};

const focusFor = (stepId) =>
  STEP_FOCUS[stepId] || BLOCKS.find((b) => `b${b.no}` === stepId)?.focus || "";

export function NowCard({ step, status, timeLeft, record, onOpen, overdue = [], commitment }) {
  if (!step) return null;
  const done = status === "Done";
  const action = done ? "Review" : record ? "Continue" : "Open";

  return (
    <section className="rounded-2xl bg-gold p-4 text-gold-foreground">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[14px] font-semibold">Now</span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-foreground/15 px-2.5 py-1 text-[14px] font-medium">
          <Clock className="h-4 w-4" />
          {timeLeft}
        </span>
      </div>
      <h2 className="mt-1 font-heading text-[26px] font-semibold leading-tight">{step.label}</h2>
      <p className="mt-1 text-[15px] leading-snug">{focusFor(step.id)}</p>
      <p className="mt-1 text-[14px] opacity-80">
        {step.start}–{step.end}
        {step.meeting ? ` · ${step.meeting} ${step.meeting_time}` : ""}
      </p>

      {commitment ? (
        <p className="mt-2 rounded-xl bg-gold-foreground/10 px-3 py-2 text-[14px]">
          Your first-shift commitment: {commitment}
        </p>
      ) : null}

      <button
        type="button"
        onClick={onOpen}
        className="mt-3 inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-gold-foreground px-5 text-[17px] font-semibold text-gold"
      >
        {action} {step.short}
        <ChevronRight className="h-5 w-5" />
      </button>

      {overdue.length ? (
        <div className="mt-3 rounded-xl bg-gold-foreground/10 px-3 py-2">
          <p className="text-[14px] font-semibold">Open from a No</p>
          {overdue.map((line, i) => (
            <p key={i} className="text-[14px]">
              Line {line.line_no}: {line.action} · {line.owner} · {line.by_date}
            </p>
          ))}
        </div>
      ) : null}
    </section>
  );
}