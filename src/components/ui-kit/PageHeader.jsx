export function PageHeader({ title, intro, brand = false }) {
  const tone = brand ? "!text-gold" : "text-foreground";
  const box = brand
    ? "mb-5 inline-block max-w-full rounded-xl bg-navy/85 px-4 py-3 backdrop-blur-sm"
    : "mb-5";
  return (
    <div className={box}>
      <h1 className={`font-heading text-[27px] font-semibold leading-tight sm:text-[32px] ${tone}`}>{title}</h1>
      {intro ? <p className={`mt-2 text-[16px] leading-snug ${tone}`}>{intro}</p> : null}
    </div>
  );
}