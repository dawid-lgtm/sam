import { CalendarDays, Clock, Users } from "lucide-react";

export function NextMeetingCard({ meeting }) {
  return (
    <section className="mt-6">
      <h2 className="mb-3 font-heading text-[21px] font-semibold text-foreground">Your next meeting</h2>
      <div className="overflow-hidden rounded-2xl bg-card">
        <div className="flex flex-wrap items-center justify-between gap-2 bg-background/40 px-4 py-2.5">
          <span className="text-[15px] font-medium text-foreground">{meeting.cadence} meeting</span>
          <span className="text-[15px] text-muted-foreground">{meeting.date_label}</span>
        </div>
        <div className="px-4 py-4">
          <h3 className="font-heading text-[20px] font-semibold leading-snug text-foreground">{meeting.title}</h3>
          <div className="mt-3 space-y-2 text-[15px] text-muted-foreground">
            <p className="flex items-center gap-2">
              <Clock className="h-5 w-5 shrink-0" /> {meeting.time} · {meeting.duration}
            </p>
            <p className="flex items-center gap-2">
              <Users className="h-5 w-5 shrink-0" /> {meeting.owner}
            </p>
            <p className="flex items-start gap-2">
              <CalendarDays className="mt-0.5 h-5 w-5 shrink-0" /> {meeting.decides}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}