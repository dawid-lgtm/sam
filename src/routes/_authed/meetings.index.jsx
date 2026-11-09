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

  if (isLoading || !data) return <div className="h-56 animate-pulse rounded-2xl bg-white" />;

  const headOffice = data.meetings.filter((m) => m.scope === "Head office");
  const shift = (n) => setCursor((c) => c.clone().add(n, "month"));

  return (
    <div className="animate-in fade-in duration-300">
      <PageHeader eyebrow="Tool 4" title="Meetings" intro="The rhythm that keeps the strategy visible: IN runs the work, ON improves it." />

      <div className="mb-4 flex gap-2">
        <span className="flex min-h-[40px] items-center rounded-full bg-navy px-4 text-sm font-medium text-white">Calendar</span>
        <Link to="/meetings/year" className="flex min-h-[40px] items-center rounded-full bg-white px-4 text-sm font-medium text-muted-foreground">
          Year view
        </Link>
      </div>

      <Section title={moment.utc({ year: cursor.year(), month: cursor.month(), day: 1 }).format("MMMM YYYY")} subtitle="Weeks 1 to 4, Monday to Friday.">
        <div className="mb-3 flex items-center justify-between">
          <button onClick={() => shift(-1)} aria-label="Previous month" className="grid h-10 w-10 place-items-center rounded-xl border border-border text-navy">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <p className="text-[13px] font-medium text-muted-foreground">
            {MONTH_LABELS[cursor.month()]} {cursor.year()}
          </p>
          <button onClick={() => shift(1)} aria-label="Next month" className="grid h-10 w-10 place-items-center rounded-xl border border-border text-navy">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <MonthGrid meetings={data.meetings} cursor={cursor} />
        <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-navy/15" /> IN — running the work</span>
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-gold/40" /> ON — improving the work</span>
        </div>
      </Section>

      <Section className="mt-4" title="Head office">
        <div className="space-y-2.5">
          {headOffice.length ? headOffice.map((m) => <MeetingCard key={m.id} meeting={m} />) : <EmptyLine>No head office meetings yet.</EmptyLine>}
        </div>
      </Section>

      {data.sites.map((site) => {
        const siteMeetings = data.meetings.filter((m) => m.site_id === site.id);
        return (
          <Section key={site.id} className="mt-4" title={site.name}>
            <div className="space-y-2.5">
              {siteMeetings.length ? siteMeetings.map((m) => <MeetingCard key={m.id} meeting={m} />) : <EmptyLine>No meetings set for this site.</EmptyLine>}
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