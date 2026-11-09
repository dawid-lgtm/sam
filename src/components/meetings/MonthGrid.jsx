import { DAY_LABELS, cellDate, meetingsInCell } from "@/lib/meetings";

const short = (m) => (m.title || "").replace("Head office", "Head off.").replace("Kestrel Underground", "Kestrel");

export function MonthGrid({ meetings, cursor }) {
  const year = cursor.year();
  const month = cursor.month();

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="grid grid-cols-5 bg-secondary/60">
        {DAY_LABELS.map((d) => (
          <div key={d} className="py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {d}
          </div>
        ))}
      </div>
      {[1, 2, 3, 4].map((week) => (
        <div key={week}>
          <p className="border-t border-border bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
            Week {week}
          </p>
          <div className="grid grid-cols-5">
            {[1, 2, 3, 4, 5].map((day) => {
              const cell = meetingsInCell(meetings, week, day);
              const date = cellDate(year, month, week, day);
              return (
                <div key={day} className="min-h-[62px] border-r border-t border-border/60 p-1 last:border-r-0">
                  <p className="text-[10px] font-medium text-muted-foreground/80">{date.format("D")}</p>
                  {cell.map((m) => (
                    <div
                      key={m.id}
                      title={`${m.title} — ${m.start_time}, ${m.duration_min} min`}
                      className={`mt-0.5 truncate rounded px-1 py-0.5 text-[9.5px] font-semibold leading-tight ${
                        m.cadence === "ON" ? "bg-gold/30 text-[#6b540f]" : "bg-navy/10 text-navy"
                      }`}
                    >
                      {short(m)}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}