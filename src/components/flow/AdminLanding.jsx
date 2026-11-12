import { Frame, MockCard, MockRow, MockTap } from "@/components/flow/MockScreen";

// The administrator's landing page: the two things the welcome email tells him to do, then the reference sections.
export function AdminLanding() {
  return (
    <Frame label="Home · Administrator">
      <MockCard title="Welcome, Vahid" note="MMS · Administrator · Managing Strategy">
        <p className="text-muted-foreground">Thursday, 12 November · the program has not been launched yet.</p>
      </MockCard>

      <MockCard gold title="What you need to do next">
        <p className="font-semibold">1 · Load your people</p>
        <p className="text-muted-foreground">
          Name, site, the role each one holds and who they report to. The role cannot be skipped, and every person you
          add is invited by email.
        </p>
        <MockRow arrow>People and roles · 2 of 9 added</MockRow>
        <p className="pt-1 font-semibold">2 · Launch the program</p>
        <p className="text-muted-foreground">
          The Launch the program step below will unlock once step one is completed.
        </p>
      </MockCard>

      <MockTap locked>Locked · Launch the program</MockTap>

      <MockCard title="Also on this page">
        <MockRow arrow>Org chart · 9 people, as you entered them</MockRow>
        <MockRow arrow>Deployment methodology · step by step</MockRow>
        <MockRow arrow>Tools and artifacts · handbooks, agendas, coaching cards</MockRow>
      </MockCard>
    </Frame>
  );
}