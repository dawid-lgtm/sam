import { useState } from "react";
import { FlowDiagram } from "@/components/flow/FlowDiagram";
import { UserFlow } from "@/components/flow/UserFlow";

const FLOWS = [
  {
    key: "strategy",
    name: "Managing Strategy",
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
    key: "ops",
    name: "Managing Ops & Maintenance",
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
  const [prog, setProg] = useState("strategy");
  const flow = FLOWS.find((f) => f.key === prog);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {FLOWS.map((f) => (
          <button
            key={f.key}
            onClick={() => setProg(f.key)}
            className={`rounded-lg px-3 py-2 text-[14px] font-bold ${
              prog === f.key ? "bg-gold text-gold-foreground" : "bg-secondary text-foreground"
            }`}
          >
            {f.name}
          </button>
        ))}
      </div>
      <FlowDiagram steps={flow.steps} />
      {prog === "strategy" ? <UserFlow /> : null}
    </div>
  );
}