import { createFileRoute } from "@tanstack/react-router";
import moment from "moment";
import { Lock } from "lucide-react";
import { useSamData } from "@/lib/useSamData";
import { EmptyLine } from "@/components/ui-kit/Section";

export const Route = createFileRoute("/_authed/strategy/changelog")({
  component: ChangeLog,
});

function ChangeLog() {
  const { data, isLoading } = useSamData();
  if (isLoading || !data) return <div className="h-40 animate-pulse rounded-2xl bg-white" />;

  return (
    <div className="space-y-3">
      <p className="flex items-center gap-2 rounded-xl border border-border bg-white px-3 py-2.5 text-[13px] text-muted-foreground">
        <Lock className="h-4 w-4 shrink-0" /> Entries cannot be edited or deleted.
      </p>

      {data.changeLog.length ? (
        data.changeLog.map((entry) => (
          <div key={entry.id} className="rounded-2xl border border-border bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center rounded-lg bg-accent px-2 py-1 text-[12px] font-bold text-[#7a6114]">
                {entry.objective_code}
              </span>
              <span className="text-xs text-muted-foreground">
                {moment.utc(entry.log_date).format("D MMM YYYY")}
              </span>
            </div>
            <p className="mt-2.5 text-[15px] font-medium leading-snug text-navy">{entry.change}</p>
            <p className="mt-2 text-sm leading-snug text-muted-foreground">
              <span className="font-semibold text-navy">Cause: </span>
              {entry.cause}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
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
  );
}