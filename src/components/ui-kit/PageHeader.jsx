export function PageHeader({ eyebrow, title, intro }) {
  return (
    <div className="mb-5">
      {eyebrow ? (
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7a6114]">{eyebrow}</p>
      ) : null}
      <h1 className="mt-1 text-[26px] font-semibold leading-tight text-navy sm:text-[30px]">{title}</h1>
      {intro ? <p className="mt-2 text-[15px] leading-snug text-muted-foreground">{intro}</p> : null}
    </div>
  );
}