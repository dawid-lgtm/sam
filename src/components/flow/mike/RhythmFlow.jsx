import { Modal } from "@/components/ui-kit/Modal";
import { RhythmDiagram } from "@/components/flow/mike/RhythmDiagram";

// The pop-up behind "See the rhythm" on card 4.
export function RhythmFlow({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title="The meeting rhythm">
      <p className="mb-3 text-[14px] leading-snug text-muted-foreground">
        Three meetings, one line. What is worked in the weekly meeting is decided in the monthly one, and read by the
        enterprise above it.
      </p>

      <RhythmDiagram />

      <p className="mt-3 rounded-xl bg-background/40 px-2.5 py-2 text-[12px] leading-snug text-muted-foreground">
        Both agendas and coaching cards come with the program, so the weekly and the monthly meeting run to the same
        standard at every site.
      </p>
    </Modal>
  );
}