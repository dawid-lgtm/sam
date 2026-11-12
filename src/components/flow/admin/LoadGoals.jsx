import { Frame, MockCard, MockField, MockRow, MockTap } from "@/components/flow/MockScreen";

// The tick at the top of the launch page lands here: he types the Goal and Objectives the room agreed.
export function LoadGoals() {
  return (
    <Frame label="Enter the Goal and Objectives">
      <MockCard gold title="1 · The Goal" note="One sentence, three years out">
        <MockField value="Be the safest, lowest cost 2 Mt a year underground mine in the region by 2029." />
        <p className="text-muted-foreground">Typed exactly as the room wrote it. Every site sees this sentence.</p>
      </MockCard>

      <MockCard title="2 · The Objectives" note="3 of 5 · one executive owner each">
        <p className="font-semibold">O1</p>
        <MockField label="Objective" value="Zero serious incidents" />
        <MockField label="Owner · metric" value="COO · TRIFR" />

        <p className="pt-1 font-semibold">O2</p>
        <MockField label="Objective" value="90% fleet availability" />
        <MockField label="Owner · metric" value="GM Ops · availability %" />

        <p className="pt-1 font-semibold">O3</p>
        <MockField label="Objective" value="12% lower cost per tonne" />
        <MockField label="Owner · metric" value="CFO · $/t" />

        <MockRow arrow>Add objective · 2 places left</MockRow>
        <p className="text-muted-foreground">Five is the ceiling. An objective with no owner will not save.</p>
      </MockCard>

      <MockTap>Save</MockTap>

      <MockCard title="On save" note="Sam's next question">
        <p>It opens the date for the second workshop, with the roles it needs already ticked.</p>
      </MockCard>
    </Frame>
  );
}