import { Frame, MockCard, MockField, MockTap } from "@/components/flow/MockScreen";

// Ticked completed: Sam will not launch on an empty frame, so the Goal and Objectives come in first.
export function LoadGoals() {
  return (
    <Frame label="Load what the room agreed">
      <MockCard gold title="The Goal" note="One sentence, three years out">
        <MockField value="Be the safest, lowest cost 2 Mt a year underground mine in the region by 2029." />
      </MockCard>

      <MockCard title="The Objectives · 3 of 5" note="One executive owner each">
        <p>O1 · Zero serious incidents · COO</p>
        <p>O2 · 90% fleet availability · GM Ops</p>
        <p>O3 · 12% lower cost per tonne · CFO</p>
      </MockCard>

      <MockTap>Save</MockTap>

      <MockCard title="On save" note="Sam's next question">
        <p>It opens the date for the second workshop, with the roles it needs in the room.</p>
      </MockCard>
    </Frame>
  );
}