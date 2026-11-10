import { createFileRoute } from "@tanstack/react-router";
import { FlowTest } from "@/components/flow/FlowTest";
export const Route = createFileRoute("/shot-flow")({ component: () => <div className="min-h-screen bg-background p-4 text-foreground"><FlowTest /></div> });
