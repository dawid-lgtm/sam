import { format } from "date-fns";

/** The next few key dates, as a compact list beside the calendar. */
export function UpcomingEvents({ dates = [], limit = 3 }) {
  const today = format(new Date(), "yyyy-MM-dd");
  const upcoming = dates
    .filter((d) => String(d.date || "").slice(0, 10) >= today)
    .sort((a, b) => String(a.date).localeCompare(String(b.date)))
    .slice(0, limit);

  return (
    <div className="min-w-[160px] flex-1">
      <p className="mb-1 text-[11px] font-semibold text-muted-foreground">Coming up</p>
      {upcoming.length ? (
        <ul className="space-y-1">
          {upcoming.map((event) => (
            <li key={event.id} className="flex items-baseline gap-2 rounded bg-background/40 px-2 py-1">
              <span className="shrink-0 text-[11px] font-semibold text-gold">
                {format(new Date(`${String(event.date).slice(0, 10)}T00:00:00`), "d MMM")}
              </span>
              <span className="min-w-0 text-[12px] leading-snug">{event.label}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded bg-background/40 px-2 py-1 text-[12px] text-muted-foreground">Nothing coming up yet.</p>
      )}
    </div>
  );
}