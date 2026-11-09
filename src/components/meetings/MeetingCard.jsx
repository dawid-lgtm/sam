import { Pill } from "@/components/ui-kit/Section";

export function MeetingCard({ meeting }) {
  const weeks = (meeting.weeks || []).join(", ");
  return (
    <div className="rounded-xl border border-border p-3.5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[15px] font-semibold leading-snug text-navy">{meeting.title}</p>
        <Pill tone={meeting.cadence === "ON" ? "gold" : "neutral"}>{meeting.cadence}</Pill>
      </div>
      <p className="mt-1.5 text-[12px] text-muted-foreground">
        Week {weeks} · {meeting.start_time} · {meeting.duration_min} min
      </p>
      <p className="mt-1 text-[12px] text-muted-foreground">{meeting.owner}</p>
      <p className="mt-1.5 text-[13px] leading-snug text-navy/80">Decides: {meeting.decides}</p>
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
    <ol className="space-y-2">
      {rules.map((rule, i) => (
        <li key={rule} className="flex gap-2.5 text-[13px] leading-snug text-navy">
          <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gold/25 text-[11px] font-bold text-[#7a6114]">
            {i + 1}
          </span>
          {rule}
        </li>
      ))}
    </ol>
  );
}