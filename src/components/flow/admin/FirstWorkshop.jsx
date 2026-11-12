import { Frame, MockCard, MockField, MockRow, MockTap } from "@/components/flow/MockScreen";

// Step 1 of the launch: the first workshop, dated, with the completed button at the very top.
export function FirstWorkshop() {
  return (
    <Frame label="Launch the program · Step 1">
      <div className="rounded-lg bg-gold px-3 py-3 text-center text-[14px] font-bold leading-tight text-gold-foreground ring-2 ring-gold">
        This workshop has been completed
      </div>
      <p className="px-0.5 text-[12px] leading-snug text-muted-foreground">
        If it is done, tick this button and Sam goes straight to the finalised Goal and Objectives.
      </p>

      <MockCard title="What this workshop is for">
        <p>
          One half day with your leadership team to agree the single three-year Goal, and the objectives that carry
          it, in the room, in your words.
        </p>
      </MockCard>

      <MockCard title="Who should be in the room">
        <p>CEO and the ELT · the regional GMs · your program managers · each site lead.</p>
      </MockCard>

      <MockField label="Date and time" value="Tue 18 Nov · 8:00 am to 12:00 pm" />

      <MockRow arrow>Open the workshop tool · agenda, GOSPA sheet, slides</MockRow>
      <MockTap>Save the date</MockTap>
    </Frame>
  );
}