import { Frame, MockCard, MockField, MockRow, MockTap } from "@/components/flow/MockScreen";

// The add objective sheet opens over card 5A: one objective, one owner, one metric, all blank.
export function AddObjectiveSheet() {
  return (
    <Frame label="Enter the Goal and Objectives · add objective">
      <MockCard gold title="Add objective" note="4 objective spaces left · 5 is the max">
        <MockField label="The objective" placeholder="Type the objective" />
        <MockField label="What it delivers" placeholder="The outcome, in one sentence" />
        <MockField label="Executive owner" placeholder="Choose the person who owns it" />
        <MockField label="The metric it moves" placeholder="The one number you will watch" />
        <MockField label="Target date" placeholder="When it must be true" />
        <MockRow arrow>Choose the owner from the people you loaded</MockRow>
      </MockCard>

      <MockTap>Add objective</MockTap>

      <MockTap quiet>Cancel</MockTap>

      <MockCard title="Before it saves" note="Sam checks two things">
        <p>An objective with no executive owner will not save.</p>
        <p className="text-muted-foreground">
          Five is the ceiling: the add button disappears once there are five.
        </p>
      </MockCard>
    </Frame>
  );
}