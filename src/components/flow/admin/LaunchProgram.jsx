import { Frame, MockCard, MockField, MockRow, MockTap } from "@/components/flow/MockScreen";

// Step 2 on the admin page: name the date of the first workshop, or tick it as already held.
export function LaunchProgram() {
  return (
    <Frame label="Launch the program · Step 2">
      <MockCard title="Nine people loaded" note="Every one has a role and a manager in the org chart.">
        <MockRow arrow>Check the org chart</MockRow>
      </MockCard>

      <MockCard gold title="The first workshop">
        <p className="font-semibold">Defining the Goals and Objectives</p>
        <p className="text-muted-foreground">CEO and ELT, before the leadership workshop.</p>
        <MockField label="Date of the first workshop" value="Thursday 20 November 2026" />
      </MockCard>

      <MockCard title="Already held it?">
        <p>Tick this and Sam asks for the Goal and Objectives the room agreed, instead of a date.</p>
        <MockRow>☑ Workshop completed</MockRow>
      </MockCard>

      <MockTap>Launch the program</MockTap>
    </Frame>
  );
}