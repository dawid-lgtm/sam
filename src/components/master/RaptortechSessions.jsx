import { shortDate } from "@/lib/raptortechData";

export function RaptortechSessions({ sessions = [] }) {
  if (!sessions.length) {
    return <p className="rounded-xl bg-background/40 px-3 py-4 text-[14px] text-muted-foreground">Nothing booked yet.</p>;
  }

  return (
    <ul className="space-y-2">
      {sessions.map((session) => (
        <li key={session.id} className="flex items-start gap-3 rounded-xl bg-background/40 p-2.5">
          <span className="grid w-12 shrink-0 place-items-center rounded-lg bg-gold px-1 py-1.5 text-center text-[12px] font-semibold leading-tight text-gold-foreground">
            {shortDate(session.date)}
          </span>
          <div className="min-w-0">
            <p className="text-[14px] font-semibold leading-snug">{session.title}</p>
            <p className="text-[12px] text-muted-foreground">
              {session.customer} · {session.mode}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}