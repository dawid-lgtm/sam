import { X } from "lucide-react";
import { Frame } from "@/components/flow/MockScreen";
import { RhythmDiagram } from "@/components/flow/mike/RhythmDiagram";

// The pop-up itself, drawn inside the phone frame rather than over the whole screen.
export function RhythmSheet() {
  return (
    <Frame label="Home · the rhythm, opened over card 4">
      <div className="rounded-2xl bg-background/70 p-2.5 ring-1 ring-gold/40">
        <div className="mb-2 flex items-start justify-between gap-2">
          <p className="font-heading text-[17px] font-semibold leading-snug">The meeting rhythm</p>
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-background/60 text-muted-foreground">
            <X className="h-4 w-4" />
          </span>
        </div>
        <p className="mb-2 text-[12px] leading-snug text-muted-foreground">
          Three meetings, one line. What is worked in the weekly meeting is decided in the monthly one, and read by
          the enterprise above it.
        </p>
        <RhythmDiagram />
        <p className="mt-2 rounded-xl bg-background/40 px-2.5 py-2 text-[11px] leading-snug text-muted-foreground">
          Both agendas and coaching cards come with the program.
        </p>
      </div>
    </Frame>
  );
}