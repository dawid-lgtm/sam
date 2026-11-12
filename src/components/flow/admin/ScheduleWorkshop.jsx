import { Frame, MockCard, MockField, MockPill, MockRow, MockTap } from "@/components/flow/MockScreen";

// The save on the Goal and Objectives turns straight into this: date the second workshop, with who must be in it.
export function ScheduleWorkshop() {
  return (
    <Frame label="Schedule the second workshop">
      <MockCard gold title="The Goal and Objectives are saved">
        <p className="text-muted-foreground">Next: reviewing them and defining the Strategies, as a group.</p>
      </MockCard>

      <MockCard title="Who has to be in the room" note="Only the roles that exist in his org are offered">
        <p>☑ Program managers · 2 <MockPill>Mike Tau</MockPill></p>
        <p>☑ GMs · 2 <MockPill>Sarah Bell</MockPill></p>
        <p>☑ CEO and ELT · 3</p>
        <p>☐ Department heads · none in the org yet</p>
        <MockRow arrow>Add the roles he is missing</MockRow>
      </MockCard>

      <MockCard title="When">
        <MockField label="Second workshop · full day" value="Tuesday 24 November 2026 · 8:00–16:30" />
        <p className="text-muted-foreground">Nine people · the agenda comes from the Managing Strategy handbook.</p>
      </MockCard>

      <MockTap>Schedule and send</MockTap>

      <MockCard title="Then: the wider ELT team" note="6 people · they were not in workshop one">
        <p>Priya Nair · GM Processing</p>
        <p>Tom Reid · Maintenance manager</p>
        <p>Ana Silva · HR lead</p>
        <p>Ellie Wong · Finance lead</p>
        <p className="text-muted-foreground">
          This list is who will get it: the rest of the leadership team, with the same date and the Goal and
          Objectives already inside.
        </p>
      </MockCard>

      <MockTap>Send invite to the wider ELT team</MockTap>
    </Frame>
  );
}