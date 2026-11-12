import { FlowDiagram } from "@/components/flow/FlowDiagram";

const FLOWS = [
  {
    name: "Managing Strategy (GOSTPA)",
    steps: [
      { label: "Goal", who: "CEO and ELT" },
      { label: "Objectives", who: "CEO and ELT" },
      { label: "Briefing workshop", who: "Program Lead" },
      { label: "Strategies", who: "Regional GM with the PMs" },
      { label: "Tactics", who: "Project Manager" },
      { label: "Plans", who: "Site leaders" },
      { label: "Actions", who: "Site leaders, name and date" },
      { label: "ON the business", who: "Monthly, site then head office" },
    ],
  },
  {
    name: "Ops and Maintenance Phase 1 (CML)",
    steps: [
      { label: "Briefing", who: "Project Manager" },
      { label: "Prime workbook", who: "Superintendent and Supervisor" },
      { label: "Sign-off", who: "Superintendent, then PM" },
      { label: "Validation Lab", who: "Facilitator" },
      { label: "Apply on site", who: "Everyone" },
    ],
  },
];

export function FlowTest() {
  return (
    <div className="space-y-4">
      {FLOWS.map((flow) => (
        <div key={flow.name}>
          <p className="mb-2 px-1 text-[15px] font-semibold text-gold">{flow.name}</p>
          <FlowDiagram steps={flow.steps} />
        </div>
      ))}
    </div>
  );
}