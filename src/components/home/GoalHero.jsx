export function GoalHero({ goal }) {
  return (
    <section className="rounded-2xl bg-card p-5 sm:p-6">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-[15px] font-medium text-foreground">
          <span className="h-4 w-1.5 rounded-full bg-gold" />
          The goal
        </span>
      </div>
      <h1 className="font-heading text-[26px] font-semibold leading-[1.25] text-foreground sm:text-[32px]">{goal}</h1>
      <p className="mt-4 text-[15px] leading-snug text-muted-foreground">
        Every objective, strategy and site task answers to this one sentence.
      </p>
    </section>
  );
}