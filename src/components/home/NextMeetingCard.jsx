import { CalendarDays, Clock, Users } from "lucide-react";

export function NextMeetingCard({ meeting }) {
  return (
    <section className="mt-6">
      <h2 className="mb-3 text-lg font-semibold text-navy">Your next meeting</h2>
      <div className="overflow-hidden rounded-2xl border border-border bg-white">
        <div className="flex items-center justify-between bg-accent px-4 py-2.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7a6114]">
            {meeting.cadence} meeting
          </span>
          <span className="text-xs font-medium text-[#7a6114]">{meeting.date_label}</span>
        </div>
        <div className="px-4 py-4">
          <h3 className="text-[19px] font-semibold leading-snug text-navy">{meeting.title}</h3>
          <div className="mt-3 space-y-2 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0" /> {meeting.time} · {meeting.duration}
            </p>
            <p className="flex items-center gap-2">
              <Users className="h-4 w-4 shrink-0" /> {meeting.owner}
            </p>
            <p className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 shrink-0" /> {meeting.decides}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}