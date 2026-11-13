import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ChevronRight, Lock, GraduationCap, Settings2, Users, AlertTriangle } from "lucide-react";
import { useOps, fieldCoachUnlocked } from "@/lib/useOps";
import { currentStep, minutesLeft, nowMinutes, stepStatus, stepsFor } from "@/lib/opsShift";
import { openActions } from "@/lib/opsMarks";
import { createShift } from "@/lib/opsStore";
import { isAdministrator } from "@/lib/access";
import { NowCard } from "@/components/ops/NowCard";
import { DayStrip } from "@/components/ops/DayStrip";

export const Route = createFileRoute("/_authed/operations/")({
  ssr: false,
  component: OperationsToday,
  head: () => ({ meta: [{ title: "Sam — Operations" }] }),
});

function OperationsToday() {
  const { user, data, isLoading, refresh } = useOps();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  if (isLoading || !data) return <div className="h-56 animate-pulse rounded-2xl bg-card" />;

  if (!data.enrolment) {
    return (
      <div>
        <h1 className="font-heading text-[26px] font-semibold text-foreground">Operations</h1>
        <div className="sam-glass mt-3 p-4">
          <p className="text-[16px] text-foreground">You are not enrolled in an Ops program yet.</p>
          <p className="mt-1 text-[15px] text-muted-foreground">
            A facilitator or your client admin puts you in a cohort. Once you are in, Prime starts on your next roster.
          </p>
          {isAdministrator(user) ? (
            <Link to="/operations/cohort" className="mt-3 inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-gold px-4 text-[16px] font-semibold text-gold-foreground">
              <Users className="h-5 w-5" /> Set up a cohort
            </Link>
          ) : null}
        </div>
      </div>
    );
  }

  if (!fieldCoachUnlocked(data)) {
    return (
      <div>
        <h1 className="font-heading text-[26px] font-semibold text-foreground">Prime</h1>
        <p className="text-[15px] text-muted-foreground">
          {data.enrolment.stage === "Lab" ? "Validation Lab" : "Over one roster, on shift"} · ten tasks
        </p>
        <div className="sam-glass mt-3 p-4">
          <p className="flex items-center gap-2 text-[16px] font-semibold text-foreground">
            <GraduationCap className="h-5 w-5 text-gold" /> Training comes first
          </p>
          <p className="mt-1 text-[15px] leading-snug text-muted-foreground">
            Work through the ten Prime tasks, then the Validation Lab. The Field Coach unlocks when your facilitator
            marks the Lab complete.
          </p>
          <Link to="/operations/prime" className="mt-3 inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-gold px-4 text-[16px] font-semibold text-gold-foreground">
            Open Prime
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
        <p className="mt-3 flex items-start gap-2 rounded-xl bg-background/40 p-3 text-[15px] leading-snug text-muted-foreground">
          <Lock className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
          The four blocks, the handover and pre-start agendas, the Shift Report and the handbook stay closed until the
          Lab. That is on purpose.
        </p>
      </div>
    );
  }

  const shift = data.shift;
  const steps = stepsFor(data.setting, shift?.day_night || "Day");
  const records = data.records || {};
  const statuses = Object.fromEntries(steps.map((s) => [s.id, stepStatus(s, records[s.id])]));
  const now = nowMinutes();
  const next = currentStep(steps, records, now);
  const nowStep = next?.step;

  const allMarks = Object.values(records).flatMap((r) => r?.marks || []);
  const actions = openActions(
    Object.fromEntries(allMarks.filter((m) => m.value === "No").map((m) => [m.line_no, m])),
  );
  const late = steps.filter((s) => statuses[s.id] === "Late" && s.id !== "report" && s.id !== "handover_out");

  const startShift = async (dayNight) => {
    setBusy(true);
    try {
      await createShift(user, data.setting, dayNight);
      await refresh();
      toast.success(`${dayNight} shift started.`);
    } catch {
      toast.error("Could not start the shift. Try again when you have signal.");
    } finally {
      setBusy(false);
    }
  };

  const coach = ["superintendent", "facilitator"].includes(user?.access) || isAdministrator(user);

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h1 className="font-heading text-[26px] font-semibold leading-tight text-foreground">Today</h1>
          <p className="text-[15px] text-muted-foreground">
            {user?.full_name || user?.email} · {user?.site_name || "your site"}
            {shift ? ` · ${shift.day_night} shift` : ""}
          </p>
        </div>
        <div className="flex gap-1.5">
          {coach ? (
            <Link to="/operations/coach" className="grid h-11 w-11 place-items-center rounded-xl bg-card" title="Coach view">
              <Users className="h-5 w-5 text-gold" />
            </Link>
          ) : null}
          <Link to="/operations/settings" className="grid h-11 w-11 place-items-center rounded-xl bg-card" title="Shift settings">
            <Settings2 className="h-5 w-5 text-gold" />
          </Link>
        </div>
      </div>

      {!shift ? (
        <div className="sam-glass p-4">
          <p className="text-[17px] font-semibold text-foreground">Start today's shift</p>
          <p className="mt-1 text-[15px] leading-snug text-muted-foreground">
            Your four blocks, cards and Shift Report sit inside one shift. Start it here.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button type="button" disabled={busy} onClick={() => startShift("Day")} className="min-h-[52px] rounded-xl bg-gold px-3 text-[16px] font-semibold text-gold-foreground disabled:opacity-50">
              Day shift
            </button>
            <button type="button" disabled={busy} onClick={() => startShift("Night")} className="min-h-[52px] rounded-xl bg-secondary px-3 text-[16px] font-semibold text-foreground disabled:opacity-50">
              Night shift
            </button>
          </div>
        </div>
      ) : (
        <>
          <NowCard
            step={nowStep}
            status={statuses[nowStep?.id]}
            timeLeft={minutesLeft(nowStep, now)}
            record={records[nowStep?.id]}
            overdue={actions.slice(0, 3)}
            commitment={data.enrolment.first_shift_commitment}
            onOpen={() => navigate({ to: "/operations/step/$stepId", params: { stepId: nowStep.id } })}
          />

          {late.length ? (
            <p className="flex items-start gap-2 rounded-xl bg-background/50 p-3 text-[15px] leading-snug text-foreground">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              {late.map((s) => s.short).join(" · ")} {late.length > 1 ? "are" : "is"} not submitted. A late report is marked
              on the dashboard.
            </p>
          ) : null}

          <DayStrip steps={steps} statuses={statuses} />

          <div className="space-y-1.5">
            {steps.map((s) => {
              const status = statuses[s.id];
              return (
                <Link
                  key={s.id}
                  to="/operations/step/$stepId"
                  params={{ stepId: s.id }}
                  className="flex min-h-[60px] items-center gap-3 rounded-xl bg-card px-3 py-2"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-[16px] font-semibold leading-snug text-foreground">{s.label}</span>
                    <span className="block text-[14px] text-muted-foreground">
                      {s.start}–{s.end}
                      {s.meeting ? ` · ${s.meeting}` : ""}
                    </span>
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-[13px] font-medium ${status === "Done" ? "bg-gold text-gold-foreground" : status === "Due" ? "bg-foreground text-background" : "bg-background/60 text-muted-foreground"}`}>
                    {status}
                  </span>
                  <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                </Link>
              );
            })}
          </div>

          {actions.length ? (
            <div className="sam-glass p-3">
              <p className="text-[15px] font-semibold text-foreground">Actions you owe</p>
              {actions.map((a, i) => (
                <p key={i} className="mt-1 text-[14px] text-muted-foreground">
                  Line {a.line_no}: {a.action} · {a.owner} · {a.by_date}
                </p>
              ))}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}