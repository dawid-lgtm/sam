import { TestDataBadge } from "@/components/TestDataBadge";

export function GoalHero({ goal }) {
  return (
    <section className="overflow-hidden rounded-3xl bg-navy px-6 py-7 text-white shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">The goal</p>
        <TestDataBadge />
      </div>
      <h1 className="font-heading text-[26px] font-semibold leading-[1.25] sm:text-[34px]">{goal}</h1>
      <p className="mt-5 text-sm text-white/60">Every objective, strategy and site task answers to this one sentence.</p>
    </section>
  );
}