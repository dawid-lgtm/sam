import { DAY_LABELS, monthWeekStarts, meetingsInCell, meetingChip } from "@/lib/meetings";

export function MonthGrid({ meetings, cursor }) {
  const year = cursor.year();
  const month = cursor.month();
  const starts = monthWeekStarts(year, month);

  return (
    <div className="overflow-hidden rounded-xl p-1">
      <div className="grid grid-cols-5 gap-1">
        {DAY_LABELS.map((d) => (
          <div key={d} className="py-2 text-center text-[15px] font-medium text-foreground">
            {d}
          </div>
        ))}
      </div>
      {starts.map((start, weekIndex) => (
        <div key={weekIndex} className="mt-1">
          <p className="px-1 text-[15px] font-medium text-muted-foreground">Week {weekIndex + 1}</p>
          <div className="mt-1 grid grid-cols-5 gap-1">
            {[1, 2, 3, 4, 5].map((day) => {
              const date = start.clone().add(day - 1, "days");
              const inMonth = date.month() === month;
              const cell = inMonth ? meetingsInCell(meetings, weekIndex + 1, day) : [];
              return (
                <div key={day} className="min-h-[76px] rounded-lg bg-background/50 p-1">
                  {inMonth ? <p className="text-[15px] leading-tight text-muted-foreground">{date.date()}</p> : null}
                  {cell.map((m) => (
                    <div
                      key={m.id}
                      title={`${m.title} — ${m.start_time}, ${m.duration_min} min`}
                      className={`mt-1 break-words rounded px-1 py-1 text-[15px] leading-[1.15] font-medium ${
                        m.cadence === "ON" ? "bg-gold text-gold-foreground" : "bg-background text-foreground"
                      }`}
                    >
                      {meetingChip(m)}
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