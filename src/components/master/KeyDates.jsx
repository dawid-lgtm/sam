import { useState } from "react";
import { startOfMonth, format, addMonths } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

export function KeyDates({ dates = [] }) {
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const first = startOfMonth(month);
  const monthKey = format(first, "yyyy-MM");
  const daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  const lead = first.getDay();

  const events = dates
    .filter((d) => String(d.date || "").slice(0, 7) === monthKey)
    .sort((a, b) => String(a.date).localeCompare(String(b.date)));

  const marked = new Set(events.map((d) => Number(String(d.date).slice(8, 10))));
  const cells = [...Array(lead).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  return (
    <div className="w-full max-w-[300px]">
      <div className="mb-2 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setMonth(addMonths(month, -1))}
          className="grid h-8 w-8 place-items-center rounded-lg bg-background/40"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <p className="font-heading text-[16px] font-semibold">{format(first, "MMMM yyyy")}</p>
        <button
          type="button"
          onClick={() => setMonth(addMonths(month, 1))}
          className="grid h-8 w-8 place-items-center rounded-lg bg-background/40"
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {DAY_LABELS.map((label, i) => (
          <span key={`${label}-${i}`} className="text-[13px] leading-5 text-muted-foreground">
            {label}
          </span>
        ))}
        {cells.map((day, i) => (
          <div key={i} className="h-8">
            {day ? (
              <div
                className={`grid h-full place-items-center rounded-md text-[14px] ${
                  marked.has(day) ? "bg-gold font-semibold text-gold-foreground" : "bg-background/30"
                }`}
              >
                {day}
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <ul className="mt-2 space-y-1">
        {events.length ? (
          events.map((event) => (
            <li key={event.id} className="flex items-baseline gap-2 rounded-lg bg-background/40 px-2.5 py-1.5">
              <span className="text-[13px] font-semibold text-gold">{format(new Date(`${String(event.date).slice(0, 10)}T00:00:00`), "d MMM")}</span>
              <span className="text-[15px]">{event.label}</span>
            </li>
          ))
        ) : (
          <li className="rounded-lg bg-background/40 px-2.5 py-2 text-[15px] text-muted-foreground">No key dates this month.</li>
        )}
      </ul>
    </div>
  );
}