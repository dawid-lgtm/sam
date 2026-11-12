import { Frame, MockCard, MockRow } from "@/components/flow/MockScreen";

// The tools and artifacts page behind the admin page: the documents each program hands out.
export function ToolsPage() {
  return (
    <Frame label="Tools and artifacts">
      <MockCard title="What is assigned" note="Every artifact carries its program and its version">
        <MockRow arrow>Managing Strategy · handbook · v3</MockRow>
        <MockRow arrow>Full-day workshop · agenda</MockRow>
        <MockRow arrow>Site cascade · coaching card</MockRow>
      </MockCard>

      <MockCard title="Library">
        <MockRow arrow>Handbook</MockRow>
        <MockRow arrow>Agenda</MockRow>
        <MockRow arrow>Coaching card</MockRow>
        <MockRow arrow>Workbook</MockRow>
        <MockRow arrow>Slide pack</MockRow>
      </MockCard>

      <MockCard title="Opens, not downloads" note="A row opens on screen, with the file beside it">
        <p className="text-muted-foreground">He reads it in Sam, or sends it to the people in the workshop.</p>
      </MockCard>
    </Frame>
  );
}