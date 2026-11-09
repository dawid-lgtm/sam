import { DAY_LABELS, monthWeekStarts, meetingsInCell, meetingChip } from "@/lib/meetings";

const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

function Chip({ m }) {
  return (
    <div
      title={`${m.title}, ${m.start_time}, ${m.duration_min} min`}
      className={`mt-1 rounded px-2 py-1 text-[15px] leading-snug font-medium ${
        m.cadence === "ON" ? "bg-gold text-gold-foreground" : "bg-background text-foreground"
      }`}
    >
      {meetingChip(m)}
    </div>
  );
}

export function MonthGrid({ meetings, cursor }) {
  const year = cursor.year();
  const month = cursor.month();
  const starts = monthWeekStarts(year, month);

  const weeks = starts.map((start, weekIndex) =>
    [1, 2, 3, 4, 5].map((day) => {
      const date = start.clone().add(day - 1, "days");
      const inMonth = date.month() === month;
      return { day, date, inMonth, cell: inMonth ? meetingsInCell(meetings, weekIndex + 1, day) : [] };
    })
  );

  return (
    <div className="rounded-xl p-1">
      {/* Phone: one line per day that has a meeting */}
      <div className="space-y-3 md:hidden">
        {weeks.map((days, weekIndex) => (
          <div key={weekIndex}>
            <p className="text-[15px] font-semibold text-muted-foreground">Week {weekIndex + 1}</p>
            <div className="mt-1 space-y-1">
              {days.filter((d) => d.inMonth && d.cell.length).map((d) => (
                <div key={d.day} className="flex gap-3 rounded-lg bg-background/50 p-2">
                  <div className="w-24 shrink-0 text-[15px] leading-snug text-foreground">
                    {DAY_NAMES[d.day - 1]} {d.date.date()}
                  </div>
                  <div className="flex-1">
                    {d.cell.map((m) => <Chip key={m.id} m={m} />)}
                  </div>
                </div>
              ))}
              {!days.some((d) => d.inMonth && d.cell.length) ? (
                <p className="text-[15px] text-muted-foreground">No meetings this week.</p>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {/* Tablet and desktop: the Monday to Friday grid */}
      <div className="hidden md:block">
        <div className="grid grid-cols-5 gap-1">
          {DAY_LABELS.map((d) => (
            <div key={d} className="py-2 text-center text-[15px] font-medium text-foreground">{d}</div>
          ))}
        </div>
        {weeks.map((days, weekIndex) => (
          <div key={weekIndex} className="mt-1">
            <p className="px-1 text-[15px] font-medium text-muted-foreground">Week {weekIndex + 1}</p>
            <div className="mt-1 grid grid-cols-5 gap-1">
              {days.map((d) => (
                <div key={d.day} className="min-h-[76px] rounded-lg bg-background/50 p-1">
                  {d.inMonth ? <p className="text-[15px] leading-tight text-muted-foreground">{d.date.date()}</p> : null}
                  {d.cell.map((m) => <Chip key={m.id} m={m} />)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
