import { useState } from "react";
import { Frame, MockCard, MockPill, MockRow } from "@/components/flow/MockScreen";
import { RhythmFlow } from "@/components/flow/mike/RhythmFlow";

// What Mike lands on the first time he signs in: what head office has done, the rhythm he now runs, and his two steps.
export function MikeWelcome() {
  const [rhythmOpen, setRhythmOpen] = useState(false);

  return (
    <Frame label="Home · Kestrel Underground">
      <MockCard gold title="Welcome, Mike" note="Project manager · Kestrel Underground">
        <p>
          Your site is in the Managing Strategy program. The team at head office has finished the first workshop, and
          their work is now yours to carry onto site.
        </p>
      </MockCard>

      <MockCard title="What has been done" note="Agreed in the workshop · 18 Nov">
        <p className="font-semibold">The Goal</p>
        <p className="text-muted-foreground">
          Be the safest, lowest cost 2 Mt a year underground mine in the region by 2029.
        </p>
        <p className="font-semibold">3 Objectives, one executive owner each</p>
        <p>3 Strategies that deliver them <MockPill>yours to cascade</MockPill></p>
      </MockCard>

      <MockCard title="The meeting rhythm" note="Weekly, monthly, and the enterprise meeting above them">
        <p>
          <span className="font-semibold">Weekly · IN the business</span>, <span className="font-semibold">monthly ·
          ON the business</span>, and the <span className="font-semibold">quarterly enterprise ON the business</span>{" "}
          your report is read in.
        </p>
        <button
          type="button"
          onClick={() => setRhythmOpen(true)}
          className="flex w-full items-center justify-between gap-2 rounded-xl bg-gold px-2.5 py-2 text-[13px] font-semibold text-gold-foreground"
        >
          <span>See the rhythm · how they tie together</span>
          <span>›</span>
        </button>
      </MockCard>

      <RhythmFlow open={rhythmOpen} onClose={() => setRhythmOpen(false)} />

      <MockCard title="What you need to do next" note="Two steps, in order">
        <p className="font-semibold">Step 1 · Cascade the strategy</p>
        <p className="text-muted-foreground">
          Schedule a meeting with your leadership team to work through the company Goal, Objectives and Strategies.
          From that meeting they build the tactics, plans and actions that deliver them on site.
        </p>
        <MockRow arrow>Schedule the cascade meeting · your leadership team</MockRow>
        <p className="pt-1 font-semibold">Step 2 · Start the site rhythm</p>
        <p className="text-muted-foreground">
          Schedule the weekly IN the business meeting, then the monthly ON the business meeting, each with the agenda
          and coaching card provided. Invite your manager to the ON the business meetings.
        </p>
        <MockRow arrow>Schedule the weekly IN the business</MockRow>
        <MockRow arrow>Schedule the monthly ON the business · invite your manager</MockRow>
      </MockCard>

      <MockCard title="The Action Register" note="Filled from the actions, one line each">
        <p>
          Every action is registered against the tactic it serves. Each weekly IN the business works the register. Once
          a month the ON the business meeting updates the tactic pages behind it, and those pages roll up into the
          strategy implementation report the senior leadership team uses in their ON the business meetings.
        </p>
      </MockCard>
    </Frame>
  );
}