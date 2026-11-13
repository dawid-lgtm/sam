import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/AuthContext";
import { useOps } from "@/lib/useOps";
import { CoachDashboard } from "@/components/ops/CoachDashboard";

export const Route = createFileRoute("/_authed/operations/coach")({
  ssr: false,
  component: CoachPage,
  head: () => ({ meta: [{ title: "Sam — Coach view" }] }),
});

function CoachPage() {
  const { user } = useAuth();
  const { data } = useOps();

  return (
    <div className="space-y-3">
      <Link to="/operations" className="text-[15px] text-muted-foreground">
        ← Today
      </Link>
      <div>
        <h1 className="font-heading text-[26px] font-semibold leading-tight text-foreground">Coach view</h1>
        <p className="text-[15px] text-muted-foreground">
          Today, live. A No is the next thing to fix — this is coaching, not a grade.
        </p>
      </div>
      {user ? <CoachDashboard user={user} setting={data?.setting} /> : null}
    </div>
  );
}