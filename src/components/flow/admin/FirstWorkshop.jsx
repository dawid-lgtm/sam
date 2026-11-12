import { Frame, MockCard, MockField, MockRow, MockTap } from "@/components/flow/MockScreen";

// First card of Step 2: he either ticks the workshop as held, or dates it and sends the invite.
export function FirstWorkshop() {
  return (
    <Frame label="Launch the program · the first workshop">
      <div className="rounded-lg bg-gold px-3 py-3 text-center text-[14px] font-bold leading-tight text-gold-foreground ring-2 ring-gold">
        This workshop has been completed
      </div>

      <MockCard title="What this workshop is for" note="Half a day · in the room or online">
        <p>
          Agreeing the single three-year Goal, and the objectives that carry it, in your words, with the people who
          own the work.
        </p>
        <p className="text-muted-foreground">
          In the room: the CEO, the CFO, the COO, the GM Ops, your program managers and each site lead.
        </p>
      </MockCard>

      <p className="px-0.5 text-[12px] leading-snug">
        If you have completed this workshop, tick the button above, and you will be required to add the approved Goal
        and Objectives before you can continue. If it has not been held yet, schedule the workshop below and send the
        invite.
      </p>

      <MockCard title="Schedule the workshop" note="Step 1 of the launch">
        <MockField label="Workshop date and time" value="Tue 18 Nov · 8:00 am to 12:00 pm" />
        <MockRow arrow>Pick another date</MockRow>
      </MockCard>

      <MockCard title="Who gets the invite" note="5 people · they will see the date and the brief">
        <p>Sarah Bell · CEO</p>
        <p>Elle Wong · CFO</p>
        <p>Dave Kerr · COO</p>
        <p>Priya Nair · GM Ops</p>
        <p>Mike Tau · program manager</p>
        <MockRow arrow>Add someone from the people you loaded</MockRow>
        <MockRow arrow>Add a new person</MockRow>
      </MockCard>

      <MockTap>Send the invite</MockTap>

      <MockTap quiet>See the email they will get</MockTap>

      <MockCard title="The email · you can change the words" note="Sent from the program, in your name">
        <MockField label="Subject" value="You are invited · Sam workshop, Tue 18 Nov" />
        <MockField
          label="Message"
          value="You are in the room for the first Sam workshop. We will agree the Goal and the objectives for the next three years. The date and the agenda are in your diary."
        />
        <MockRow arrow>Edit the email text</MockRow>
      </MockCard>
    </Frame>
  );
}