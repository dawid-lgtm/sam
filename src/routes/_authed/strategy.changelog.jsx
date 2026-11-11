import { createFileRoute, Link } from "@tanstack/react-router";
import moment from "moment";
import { ArrowLeft, Lock } from "lucide-react";
import { useSamData } from "@/lib/useSamData";
import { PageHeader } from "@/components/ui-kit/PageHeader";
import { EmptyLine } from "@/components/ui-kit/Section";

export const Route = createFileRoute("/_authed/strategy/changelog")({
  component: ChangeLog,
});

function ChangeLog() {
  const { data, isLoading } = useSamData();
  if (isLoading || !data) return <div className="h-40 animate-pulse rounded-2xl bg-card" />;

  return (
    <div>
      <Link
        to="/strategy/gospa"
        className="mb-3 inline-flex min-h-[44px] items-center gap-1.5 text-[15px] font-medium text-muted-foreground"
      >
        <ArrowLeft className="h-5 w-5" /> Goal and objectives
      </Link>
      <PageHeader title="The change log" intro="Every objective change, with the reason it was needed." />

      <p className="flex items-center gap-2 rounded-xl bg-card px-3.5 py-2.5 text-[15px] text-muted-foreground">
        <Lock className="h-5 w-5 shrink-0 text-gold" /> Entries cannot be edited or deleted.
      </p>

      <div className="mt-3 space-y-3">
        {data.changeLog.length ? (
          data.changeLog.map((entry) => (
            <div key={entry.id} className="rounded-2xl bg-card p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center rounded-lg bg-gold px-2 py-1 text-[15px] font-semibold text-gold-foreground">
                  {entry.objective_code}
                </span>
                <span className="text-[15px] text-muted-foreground">
                  {moment.utc(entry.log_date).format("D MMM YYYY")}
                </span>
              </div>
              <p className="mt-2.5 text-[16px] font-medium leading-snug text-foreground">{entry.change}</p>
              <p className="mt-2 text-[15px] leading-snug text-muted-foreground">
                <span className="font-semibold text-foreground">Cause: </span>
                {entry.cause}
              </p>
              <p className="mt-2 text-[15px] text-muted-foreground">
                Board approval:{" "}
                {entry.board_approval_date ? moment.utc(entry.board_approval_date).format("D MMM YYYY") : "not recorded"}
                {entry.logged_by ? ` · logged by ${entry.logged_by}` : ""}
              </p>
            </div>
          ))
        ) : (
          <EmptyLine>No changes logged yet.</EmptyLine>
        )}
      </div>
    </div>
  );
}