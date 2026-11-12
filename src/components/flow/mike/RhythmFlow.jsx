import { Modal } from "@/components/ui-kit/Modal";

function Arrow({ label }) {
  return (
    <div className="flex flex-col items-center py-1">
      <span className="h-3 w-px bg-gold/60" />
      <span className="text-[10px] leading-none text-gold">▼</span>
      <p className="mt-0.5 text-center text-[11px] leading-snug text-muted-foreground">{label}</p>
    </div>
  );
}

function MeetingCard({ lane, title, note, children, gold }) {
  return (
    <div className={`rounded-xl p-2.5 ${gold ? "bg-gold/15 ring-1 ring-gold" : "bg-background/40"}`}>
      <p className={`text-[10px] uppercase tracking-wide ${gold ? "text-gold" : "text-muted-foreground"}`}>{lane}</p>
      <p className={`text-[14px] font-semibold ${gold ? "text-gold" : ""}`}>{title}</p>
      <p className="text-[12px] text-muted-foreground">{note}</p>
      {children ? <div className="mt-1 space-y-0.5 text-[12px] leading-snug">{children}</div> : null}
    </div>
  );
}

// The pop-up behind "See the rhythm": the site's meetings and the enterprise meeting they feed.
export function RhythmFlow({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title="The meeting rhythm">
      <p className="mb-3 text-[14px] leading-snug text-muted-foreground">
        Three meetings, one line. What is worked in the weekly meeting is decided in the monthly one, and read by the
        enterprise above it.
      </p>

      <MeetingCard
        lane="Your site · every week"
        title="IN the business"
        note="You and your leadership team · 60 minutes"
      >
        <p>Tactics, plans and actions worked, and every action closed, re-dated or raised.</p>
        <p className="text-muted-foreground">The Action Register is run here.</p>
      </MeetingCard>

      <Arrow label="the actions are tracked against the tactics" />

      <MeetingCard
        lane="Your site · once a month"
        title="ON the business"
        note="You, your leadership team and your manager"
      >
        <p>The month is reviewed and the tactics pages are updated behind it.</p>
        <p className="text-muted-foreground">The strategy implementation report is written here.</p>
      </MeetingCard>

      <Arrow label="the tactics roll up into the strategy implementation report" />

      <MeetingCard
        gold
        lane="The enterprise · quarterly"
        title="Enterprise ON the business"
        note="CEO and the executive team"
      >
        <p>Every site's strategy implementation report is read here, and the strategies are re-set.</p>
        <p className="text-muted-foreground">What is decided there comes back down to your next monthly meeting.</p>
      </MeetingCard>

      <p className="mt-3 rounded-xl bg-background/40 px-2.5 py-2 text-[12px] leading-snug text-muted-foreground">
        Both agendas and coaching cards come with the program, so the weekly and the monthly meeting run to the same
        standard at every site.
      </p>
    </Modal>
  );
}