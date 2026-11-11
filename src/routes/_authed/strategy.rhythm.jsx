import { createFileRoute } from "@tanstack/react-router";
import { RhythmExplained } from "@/components/strategy/RhythmExplained";
import { PageHeader } from "@/components/ui-kit/PageHeader";

export const Route = createFileRoute("/_authed/strategy/rhythm")({
  component: RhythmPage,
  head: () => ({ meta: [{ title: "Sam — IN, IN, IN, ON rhythm explained" }] }),
});

function RhythmPage() {
  return (
    <div>
      <PageHeader
        title="IN, IN, IN, ON rhythm explained"
        intro="Three meetings running the work, then one improving it. This is the rhythm Managing Strategy locks in."
      />
      <RhythmExplained />
    </div>
  );
}