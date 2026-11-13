import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export function StepHeader({ step, status, shift, records }) {
  const done = records?.[step.id]?.status;
  return (
    <div className="mb-3">
      <Link to="/operations" className="inline-flex min-h-[44px] items-center gap-1.5 text-[15px] text-muted-foreground">
        <ArrowLeft className="h-4 w-4" />
        Today
      </Link>
      <h1 className="font-heading text-[26px] font-semibold leading-tight text-foreground">{step.label}</h1>
      <p className="text-[15px] text-muted-foreground">
        {shift?.date} · {shift?.day_night} shift · {step.start}–{step.end}
        {step.meeting ? ` · ${step.meeting} ${step.meeting_time}` : ""}
      </p>
      <p className="text-[14px] text-muted-foreground">{step.handbook}</p>
      {done === "Done" ? <p className="mt-1 text-[15px] font-semibold text-gold">Submitted</p> : null}
      {done === "Missed" ? <p className="mt-1 text-[15px] font-semibold text-muted-foreground">Missed, with a reason</p> : null}
      {status === "Late" && !done ? <p className="mt-1 text-[15px] font-semibold text-foreground">This step is late.</p> : null}
    </div>
  );
}