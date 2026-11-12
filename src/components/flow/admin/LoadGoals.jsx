import { Frame, MockCard, MockField, MockRow, MockTap } from "@/components/flow/MockScreen";

// The tick at the top of the launch page lands here: he types the Goal and Objectives the room agreed.
export function LoadGoals() {
  return (
    <Frame label="Enter the Goal and Objectives">
      <MockCard gold title="1 · The Goal" note="One sentence, three years out">
        <MockField placeholder="Type the goal exactly as the room agreed it" />
        <p className="text-muted-foreground">Typed exactly as the room wrote it. Every site sees this sentence.</p>
      </MockCard>

      <MockCard title="2 · The Objectives" note="0 of 5 · one executive owner each">
        <p className="font-semibold">O1</p>
        <MockField label="Objective" placeholder="Type the objective" />
        <MockField label="Owner · metric" placeholder="Choose the executive owner, then the metric it moves" />

        <MockRow arrow>Add objective · 4 objectives left</MockRow>
        <p className="text-muted-foreground">Five is the ceiling. An objective with no owner will not save.</p>
      </MockCard>

      <MockTap>Save</MockTap>

      <MockCard gold title="The ELT sees this the moment he saves" note="Everyone invited to workshop one">
        <p>
          The Goal and the Objectives land on their home screen, so the room can check what it agreed before the
          second workshop is booked.
        </p>
      </MockCard>

      <MockCard title="On save" note="Sam's next question">
        <p>It opens the date for the second workshop, with the roles it needs already ticked.</p>
      </MockCard>
    </Frame>
  );
}