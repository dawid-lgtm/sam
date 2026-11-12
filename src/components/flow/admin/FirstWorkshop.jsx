import { Frame, MockCard, MockField, MockRow, MockTap } from "@/components/flow/MockScreen";

// First card of Step 2: he either ticks the workshop as held, or dates it and sends the invite.
export function FirstWorkshop() {
  return (
    <Frame label="Launch the program · the first workshop">
      <MockCard title="What this workshop is for" note="Half a day · in the room or online">
        <p>
          Agreeing the single three-year Goal, and the objectives that carry it, in your words, with the people who
          own the work.
        </p>
        <p className="text-muted-foreground">
          In the room: the CEO, the CFO, the COO, the GM Ops, your program managers and each site lead.
        </p>
      </MockCard>

      <p className="px-0.5 text-[12px] leading-snug">If this workshop has already been held, tick the box.</p>

      <div className="flex items-center gap-2 rounded-lg bg-background/40 px-2.5 py-2 text-[13px] font-semibold">
        <span className="h-4 w-4 shrink-0 rounded border border-foreground/50 bg-background/60" />
        <span>This workshop has been completed</span>
      </div>

      <p className="px-0.5 text-[12px] leading-snug">
        Ticking it means you will be required to add the approved Goal and Objectives before you can continue. If it
        has not been held yet, leave it empty, schedule the workshop below and send the invite.
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
        <MockField label="Subject" value="You have been enrolled · Managing Strategy program" />
        <div>
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Message</p>
          <div className="space-y-1.5 rounded-lg bg-background/60 px-2 py-1.5 text-[12px] leading-snug">
            <p>
              Welcome{" "}
              <span className="rounded bg-gold px-1 text-[11px] font-semibold text-gold-foreground">
                each person's name
              </span>
              ,
            </p>
            <p>
              You have been enrolled in the Decision Architecture Managing Strategy program. This program is designed to
              structure how the business manages its core strategies, from head office to the front line.
            </p>
            <p>
              The first meeting to kick off the program is scheduled for{" "}
              <span className="rounded bg-gold px-1 text-[11px] font-semibold text-gold-foreground">
                the date above
              </span>
              . We look forward to seeing you there.
            </p>
          </div>
          <p className="text-[11px] leading-snug text-muted-foreground">
            The gold fields fill in on their own for every person on the list above: their own name, and the workshop
            date.
          </p>
        </div>
        <MockRow arrow>Edit the email text</MockRow>
      </MockCard>
    </Frame>
  );
}