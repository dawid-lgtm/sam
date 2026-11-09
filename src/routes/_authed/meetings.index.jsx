import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import moment from "moment";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSamData } from "@/lib/useSamData";
import { MONTH_LABELS } from "@/lib/meetings";
import { PageHeader } from "@/components/ui-kit/PageHeader";
import { Section, EmptyLine } from "@/components/ui-kit/Section";
import { MeetingCard, RulesList } from "@/components/meetings/MeetingCard";
import { MonthGrid } from "@/components/meetings/MonthGrid";

export const Route = createFileRoute("/_authed/meetings/")({
  component: MeetingsHome,
  head: () => ({ meta: [{ title: "Sam — Meetings" }] }),
});

function MeetingsHome() {
  const { data, isLoading } = useSamData();
  const [cursor, setCursor] = useState(() => moment.utc().startOf("month"));

  if (isLoading || !data) return <div className="h-56 animate-pulse rounded-2xl bg-card" />;

  const headOffice = data.meetings.filter((m) => m.scope === "Head office");
  const shift = (n) => setCursor((c) => c.clone().add(n, "month"));

  return (
    <div>
      <PageHeader title="Meetings" intro="The rhythm that keeps the strategy visible: IN runs the work, ON improves it." />

      <div className="mb-4 grid grid-cols-2 gap-2">
        <span className="flex min-h-[48px] items-center justify-center rounded-xl bg-gold text-[15px] font-semibold text-gold-foreground">
          Calendar
        </span>
        <Link
          to="/meetings/year"
          className="flex min-h-[48px] items-center justify-center rounded-xl bg-card text-[15px] font-semibold text-muted-foreground"
        >
          Year view
        </Link>
      </div>

      <Section
        title="The month"
        subtitle="Monday to Friday. Every week of the month, week 5 when there is one."
      >
        <div className="mb-3 flex items-center justify-between">
          <button
            onClick={() => shift(-1)}
            aria-label="Previous month"
            className="grid h-12 w-12 place-items-center rounded-xl bg-secondary text-foreground"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <p className="text-[16px] font-medium text-foreground">
            {MONTH_LABELS[cursor.month()]} {cursor.year()}
          </p>
          <button
            onClick={() => shift(1)}
            aria-label="Next month"
            className="grid h-12 w-12 place-items-center rounded-xl bg-secondary text-foreground"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
        <MonthGrid meetings={data.meetings} cursor={cursor} />
        <div className="mt-3 flex flex-wrap gap-4 text-[15px] text-muted-foreground">
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 rounded bg-background" /> IN, running the work
          </span>
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 rounded bg-gold" /> ON, improving the work
          </span>
        </div>
      </Section>

      <Section className="mt-4" title="Head office">
        <div className="space-y-2.5">
          {headOffice.length ? (
            headOffice.map((m) => <MeetingCard key={m.id} meeting={m} />)
          ) : (
            <EmptyLine>No head office meetings yet.</EmptyLine>
          )}
        </div>
      </Section>

      {data.sites.map((site) => {
        const siteMeetings = data.meetings.filter((m) => m.site_id === site.id);
        return (
          <Section key={site.id} className="mt-4" title={site.name}>
            <div className="space-y-2.5">
              {siteMeetings.length ? (
                siteMeetings.map((m) => <MeetingCard key={m.id} meeting={m} />)
              ) : (
                <EmptyLine>No meetings set for this site.</EmptyLine>
              )}
            </div>
          </Section>
        );
      })}

      <Section className="mt-4" title="The four rules">
        <RulesList />
      </Section>
    </div>
  );
}