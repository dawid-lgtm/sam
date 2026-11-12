import { Frame, MockCard, MockField, MockRow, MockTap } from "@/components/flow/MockScreen";

// Step 2 on the admin page. The tick sits at the top: if the session is already held, the date is not asked for.
export function LaunchProgram() {
  return (
    <Frame label="Launch the program · Step 2">
      <MockCard gold title="Has the session been held?">
        <MockRow>☐ The first workshop has been completed</MockRow>
        <p className="text-muted-foreground">
          Tick it and Sam skips the date and asks for the Goal and Objectives the room agreed.
        </p>
      </MockCard>

      <MockCard title="Not ticked · date the workshop" note="Sam puts it straight into Meetings">
        <MockField label="Date of the first workshop" value="Thursday 20 November 2026" />
        <p className="text-muted-foreground">CEO and ELT · Defining the Goals and Objectives.</p>
      </MockCard>

      <MockRow arrow>Check the org chart · 9 people, every one with a role</MockRow>

      <MockTap>Launch the program</MockTap>
    </Frame>
  );
}