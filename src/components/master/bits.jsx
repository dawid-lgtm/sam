import { Link } from "@tanstack/react-router";
import { useProducts } from "@/lib/catalog";

const STATUS_STYLE = {
  Active: "bg-gold text-gold-foreground",
  Onboarding: "bg-background/60 text-gold",
  Prospect: "bg-background/50 text-foreground",
  Paused: "border border-foreground/40 text-foreground",
};

export function StatusChip({ status }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[14px] font-semibold ${STATUS_STYLE[status] || STATUS_STYLE.Prospect}`}>
      {status || "Prospect"}
    </span>
  );
}

export function ProductChips({ keys = [], max = 4 }) {
  const products = useProducts();
  const shown = keys.slice(0, max);
  const rest = keys.length - shown.length;
  if (!keys.length) return <span className="text-[14px] text-muted-foreground">No products yet</span>;
  return (
    <span className="flex flex-wrap gap-1.5">
      {shown.map((key) => (
        <span key={key} className="inline-flex items-center rounded-full bg-background/50 px-2.5 py-1 text-[14px]">
          {products.find((p) => p.key === key)?.name || key}
        </span>
      ))}
      {rest > 0 ? <span className="inline-flex items-center rounded-full bg-background/50 px-2.5 py-1 text-[14px]">+{rest}</span> : null}
    </span>
  );
}

export function ProgressBar({ value = 0, label }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <span className="text-[14px] text-muted-foreground">{label}</span>
        <span className="text-[14px] font-semibold">{pct}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-background/60">
        <div className="h-full rounded-full bg-gold" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function StatTiles({ tiles }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4">
      {tiles.map((t) => {
        const body = (
          <>
            <p className="font-heading text-[26px] font-semibold leading-none">{t.value}</p>
            <p className="mt-1 text-[14px] text-muted-foreground">{t.label}</p>
            {t.hint ? <p className="mt-1 text-[14px] text-gold">{t.hint}</p> : null}
          </>
        );
        return t.to ? (
          <Link key={t.label} to={t.to} className="rounded-xl bg-background/40 p-3 transition hover:ring-2 hover:ring-gold">
            {body}
          </Link>
        ) : (
          <div key={t.label} className="rounded-xl bg-background/40 p-3">
            {body}
          </div>
        );
      })}
    </div>
  );
}