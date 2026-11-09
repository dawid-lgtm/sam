export function PageHeader({ title, intro }) {
  return (
    <div className="mb-5">
      <h1 className="font-heading text-[27px] font-semibold leading-tight text-foreground sm:text-[32px]">{title}</h1>
      {intro ? <p className="mt-2 text-[16px] leading-snug text-muted-foreground">{intro}</p> : null}
    </div>
  );
}