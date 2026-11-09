import { Pill } from "@/components/ui-kit/Section";

export function MeetingCard({ meeting }) {
  const weeks = (meeting.weeks || []).join(", ");
  return (
    <div className="rounded-xl bg-background/40 p-3.5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[16px] font-medium leading-snug text-foreground">{meeting.title}</p>
        <Pill tone={meeting.cadence === "ON" ? "gold" : "neutral"}>{meeting.cadence}</Pill>
      </div>
      <p className="mt-1.5 text-[15px] leading-snug text-muted-foreground">
        Week {weeks} · {meeting.start_time} · {meeting.duration_min} min
      </p>
      <p className="mt-1 text-[15px] text-muted-foreground">{meeting.owner}</p>
      <p className="mt-1.5 text-[15px] leading-snug text-foreground">Decides: {meeting.decides}</p>
    </div>
  );
}

export function RulesList() {
  const rules = [
    "The site ON sits in week 4.",
    "The site pack reaches head office within 3 days of the site ON.",
    "Head office ON reads every site's month in week 1.",
    "The answer reaches each site within 3 days of head office ON.",
  ];
  return (
    <ol className="space-y-2.5">
      {rules.map((rule, i) => (
        <li key={rule} className="flex gap-2.5 text-[15px] leading-snug text-foreground">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gold text-[15px] font-semibold text-gold-foreground">
            {i + 1}
          </span>
          {rule}
        </li>
      ))}
    </ol>
  );
}