import { createFileRoute } from "@tanstack/react-router";
import { useSamData } from "@/lib/useSamData";
import { GoalHero } from "@/components/home/GoalHero";
import { ObjectiveList } from "@/components/home/ObjectiveList";
import { NextMeetingCard } from "@/components/home/NextMeetingCard";
import { AccessSetup } from "@/components/home/AccessSetup";
import { relevantMeetings, nextMeeting, dateLabel, timeLabel } from "@/lib/meetings";
import { accessLabel } from "@/lib/access";

export const Route = createFileRoute("/_authed/")({
  component: Home,
  head: () => ({ meta: [{ title: "Sam — Home" }] }),
});

function Home() {
  const { user } = Route.useRouteContext();
  const { data, isLoading } = useSamData();

  if (isLoading || !data) {
    return <div className="h-56 animate-pulse rounded-3xl bg-card" />;
  }

  const goal = data.company?.goal_sentence || "No goal set yet";
  const objectives = data.objectives.slice(0, 5);
  const next = nextMeeting(relevantMeetings(data.meetings, user));

  return (
    <div className="">
      {!user?.access ? <AccessSetup user={user} sites={data.sites} /> : null}

      <GoalHero goal={goal} />

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-card px-4 py-3">
        <p className="text-[15px] text-muted-foreground">You are signed in as</p>
        <p className="text-[15px] font-semibold text-foreground">{accessLabel(user)}</p>
      </div>

      <ObjectiveList objectives={objectives} />

      {next ? (
        <NextMeetingCard
          meeting={{
            cadence: next.meeting.cadence,
            title: next.meeting.title,
            date_label: dateLabel(next.date),
            time: next.meeting.start_time,
            duration: `${next.meeting.duration_min} min`,
            owner: next.meeting.owner,
            decides: next.meeting.decides,
          }}
        />
      ) : null}
    </div>
  );
}