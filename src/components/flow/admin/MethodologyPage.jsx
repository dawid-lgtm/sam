import { Frame, MockCard, MockRow } from "@/components/flow/MockScreen";

// Opened from the admin page: the deployment methodology, step by step, with where he is in it.
export function MethodologyPage() {
  return (
    <Frame label="Deployment methodology">
      <MockCard title="Three steps, in this order">
        <p className="text-muted-foreground">Smaller companies run steps 1 and 2 as one event.</p>
      </MockCard>

      <MockCard gold title="Step 1 · Defining the Goals and Objectives" note="CEO and ELT · done 12 Nov">
        <p>One three-year Goal, up to five Objectives, one ELT owner on each.</p>
      </MockCard>

      <MockCard gold title="Step 2 · Reviewing them and defining the Strategies" note="Full day · 24 Nov · up next">
        <p>Program managers, GMs and PMs review the Goal and Objectives, then design the Strategies, each with an owner and a value. Roles confirmed, the ON the business rhythm locked for twelve months.</p>
      </MockCard>

      <MockCard title="Step 3 · Cascading to site" note="Site by site · after the second workshop">
        <p>Each site turns the Strategies into Tactics, Plans and Actions, in its own ON the business meeting.</p>
      </MockCard>

      <MockCard title="What each step asks for">
        <MockRow arrow>Gate 1 · one goal, five objectives, owners, date</MockRow>
        <MockRow arrow>Gate 2 · every objective has a strategy and a value</MockRow>
        <MockRow arrow>Gate 3 · every site has a tactic, a plan and a dated action</MockRow>
      </MockCard>
    </Frame>
  );
}