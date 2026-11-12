import { Frame, MockCard, MockRow } from "@/components/flow/MockScreen";

function Bar({ label, pct, note }) {
  return (
    <div className="mb-1">
      <p className="text-[12px] font-medium leading-tight">{label}</p>
      <span className="mt-0.5 block h-1 w-full overflow-hidden rounded-full bg-background/60">
        <span className="block h-full rounded-full bg-gold" style={{ width: `${pct}%` }} />
      </span>
      <p className="text-[11px] text-muted-foreground">
        {pct}% · {note}
      </p>
    </div>
  );
}

// Once the setup steps are done the setup page is gone: his normal admin dashboard, with the real numbers.
export function AdminDashboard() {
  return (
    <Frame label="Home · Administrator">
      <MockCard title="Welcome, Vahid" note="MMS · Managing Strategy · launched">
        <p className="text-muted-foreground">Thursday, 12 November · second workshop in 12 days.</p>
      </MockCard>

      <MockCard title="Programs">
        <Bar label="Managing Strategy" pct="38" note="workshop 2 · 24 Nov" />
        <Bar label="Ops & Maintenance" pct="0" note="not started" />
      </MockCard>

      <MockCard title="Sites" note="1 of 3 has cascaded">
        <p>Kestrel Underground · 4 tactics · 2 open actions</p>
        <p className="text-muted-foreground">Talbot Open Pit · no tactic yet</p>
      </MockCard>

      <MockCard title="This week">
        <MockRow arrow>20 Nov · ELT workshop, nine people</MockRow>
        <MockRow arrow>2 actions overdue</MockRow>
        <MockRow arrow>Deployment methodology · step 2 of 3</MockRow>
      </MockCard>
    </Frame>
  );
}