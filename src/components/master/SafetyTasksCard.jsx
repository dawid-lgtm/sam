import { ShieldCheck } from "lucide-react";

const TASKS = { active: 7, dueThisWeek: 3, overdue: 1 };

export function SafetyTasksCard() {
  return (
    <section className="sam-glass p-4">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-gold" />
        <p className="text-[15px] font-semibold">Safety tasks</p>
      </div>
      <p className="mt-2 font-heading text-[30px] font-semibold leading-none">{TASKS.active}</p>
      <p className="mt-1 text-[14px] font-semibold">Active</p>
      <div className="mt-2.5 space-y-1.5">
        <div className="flex justify-between rounded-lg bg-background/40 px-2.5 py-1.5 text-[14px]">
          <span>Due this week</span>
          <span className="font-semibold">{TASKS.dueThisWeek}</span>
        </div>
        <div className="flex justify-between rounded-lg bg-background/40 px-2.5 py-1.5 text-[14px]">
          <span>Overdue</span>
          <span className="font-semibold text-gold">{TASKS.overdue}</span>
        </div>
      </div>
    </section>
  );
}