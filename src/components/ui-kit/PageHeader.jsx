export function PageHeader({ title, intro, brand = false }) {
  const tone = brand ? "text-brand" : "text-foreground";
  return (
    <div className="mb-5">
      <h1 className={`font-heading text-[27px] font-semibold leading-tight sm:text-[32px] ${tone}`}>{title}</h1>
      {intro ? <p className={`mt-2 text-[16px] leading-snug ${tone}`}>{intro}</p> : null}
    </div>
  );
}