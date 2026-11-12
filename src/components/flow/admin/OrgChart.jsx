import { Frame, MockCard, MockRow, MockPill } from "@/components/flow/MockScreen";

// The org chart he builds as he adds people: it is the same data Sam uses to decide who reports to whom.
export function OrgChart() {
  return (
    <Frame label="Org chart · 9 people">
      <MockCard title="Vahid Rahman" note="CEO · Administrator">
        <div className="border-l border-gold/50 pl-2">
          <p className="font-semibold">Sarah Bell <span className="font-normal text-muted-foreground">· GM Ops</span></p>
          <div className="border-l border-foreground/20 pl-2">
            <p>Mike Tau <span className="text-muted-foreground">· Program manager · reports to Sarah</span></p>
            <p className="text-muted-foreground">Ryan Cole · Supervisor · reports to Mike</p>
            <MockRow arrow>Add someone under Mike</MockRow>
          </div>
          <p className="pt-1">Daniel Frost <span className="text-muted-foreground">· GM Technical</span></p>
        </div>
        <MockRow arrow>Add someone under Vahid</MockRow>
      </MockCard>

      <MockCard title="Nine people, two gaps">
        <p>
          <MockPill>2</MockPill> with no role yet, so they cannot be invited.
        </p>
        <p className="text-muted-foreground">Sam shows every person once, where they report.</p>
      </MockCard>
    </Frame>
  );
}