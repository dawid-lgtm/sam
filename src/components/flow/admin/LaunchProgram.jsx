import { Lock } from "lucide-react";
import { Frame, MockCard, MockRow } from "@/components/flow/MockScreen";

// Step 2 stays locked until Step 1 is done: he cannot get past the button, and it says why.
export function LaunchProgram() {
  return (
    <Frame label="Launch the program · Step 2">
      <MockCard gold title="Step 1 is not finished" note="0 of 9 people loaded">
        <p>Add your people, and give each one a role. Step 2 opens when that is done.</p>
        <MockRow arrow>People and roles · add your first person</MockRow>
      </MockCard>

      <div className="flex items-center justify-center gap-2 rounded-lg bg-background/40 px-2.5 py-2 text-[13px] font-semibold text-muted-foreground opacity-60">
        <Lock className="h-3.5 w-3.5" /> Launch the program
      </div>

      <MockCard title="If he taps it anyway">
        <p className="rounded-lg bg-card px-2 py-1.5 text-[13px] font-semibold text-gold">
          You cannot access Step 2 until Step 1 is completed.
        </p>
        <p className="text-muted-foreground">
          The date and the tick appear only once the people are in, so nothing launches on an empty org.
        </p>
      </MockCard>

      <MockCard title="Once Step 1 is done" note="The same page, unlocked">
        <MockRow>☐ The first workshop has been completed</MockRow>
        <p className="text-muted-foreground">Ticked, Sam asks for the Goal and Objectives. Unticked, he dates the workshop.</p>
      </MockCard>
    </Frame>
  );
}