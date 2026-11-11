import { ShieldCheck } from "lucide-react";

const TASKS = { active: 7, dueThisWeek: 3, overdue: 1 };

export function SafetyTasksCard() {
  return (
    <section className="sam-glass p-2.5">
      <div className="flex items-center gap-1.5">
        <ShieldCheck className="h-3.5 w-3.5 text-gold" />
        <p className="text-[12px] font-semibold">Safety tasks</p>
      </div>
      <p className="mt-1 font-heading text-[18px] font-semibold leading-none">{TASKS.active}</p>
      <p className="text-[11px] font-semibold">Active</p>
      <div className="mt-1.5 space-y-1">
        <div className="flex justify-between rounded bg-background/40 px-1.5 py-1 text-[11px]">
          <span>Due this week</span>
          <span className="font-semibold">{TASKS.dueThisWeek}</span>
        </div>
        <div className="flex justify-between rounded bg-background/40 px-1.5 py-1 text-[11px]">
          <span>Overdue</span>
          <span className="font-semibold text-gold">{TASKS.overdue}</span>
        </div>
      </div>
    </section>
  );
}