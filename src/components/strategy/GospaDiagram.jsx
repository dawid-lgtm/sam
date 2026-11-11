import { GOSPA_SHEET } from "@/lib/gospaSheet";

function Connector({ label }) {
  return (
    <div className="flex flex-col items-center py-1.5">
      <span className="h-4 w-px bg-gold/60" />
      {label ? (
        <span className="my-1 rounded-full bg-background/60 px-2.5 py-1 text-center text-[14px] leading-snug text-muted-foreground">
          {label}
        </span>
      ) : null}
      <span className="h-4 w-px bg-gold/60" />
    </div>
  );
}

function Box({ title, body, tone = "quiet" }) {
  const skin =
    tone === "gold"
      ? "bg-gold text-gold-foreground"
      : tone === "strong"
        ? "bg-card text-foreground"
        : "bg-background/40 text-foreground";
  return (
    <div className={`h-full rounded-xl px-3 py-2.5 ${skin}`}>
      {title ? (
        <p className={`text-[14px] font-semibold ${tone === "gold" ? "text-gold-foreground" : "text-gold"}`}>{title}</p>
      ) : null}
      {body}
    </div>
  );
}

function SiteBlock({ row }) {
  return (
    <Box
      title={row.site}
      body={
        <>
          <p className="mt-1 text-[15px] font-medium leading-snug text-foreground">{row.tactic}</p>
          <p className="mt-1 text-[15px] leading-snug text-muted-foreground">
            <b className="text-foreground">Plan</b> {row.plan}
          </p>
          <p className="text-[15px] leading-snug text-muted-foreground">
            <b className="text-foreground">Action</b> {row.action}
          </p>
        </>
      }
    />
  );
}

export function GospaDiagram() {
  const { goal, objectives, example } = GOSPA_SHEET;
  const [worked] = example.strategies;

  return (
    <div>
      <Box
        tone="gold"
        title="Goal"
        body={<p className="mt-0.5 font-heading text-[19px] font-semibold leading-snug">{goal}</p>}
      />

      <Connector label="one goal for the whole company" />

      <p className="mb-1.5 text-[14px] font-semibold uppercase tracking-wide text-gold">The five objectives</p>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        {objectives.map((o) => (
          <div
            key={o.code}
            className={`rounded-xl px-2.5 py-2 text-[15px] leading-snug ${
              o.code === example.code ? "bg-gold/25 text-foreground ring-1 ring-gold" : "bg-background/40 text-foreground"
            }`}
          >
            <span className="text-[14px] font-semibold text-gold">{o.code}</span>
            <p className="mt-0.5">{o.statement}</p>
          </div>
        ))}
      </div>

      <Connector label="take one objective as the example" />

      <Box
        tone="strong"
        title={`${example.code} · worked down`}
        body={<p className="mt-0.5 text-[15px] leading-snug">{example.statement}</p>}
      />

      <Connector label="two strategies carry that objective" />

      <div className="grid gap-2 sm:grid-cols-2">
        {example.strategies.map((s) => (
          <Box
            key={s.code}
            tone={s.code === worked.code ? "strong" : "quiet"}
            title={`${s.code} · strategy`}
            body={<p className="mt-0.5 text-[15px] leading-snug">{s.statement}</p>}
          />
        ))}
      </div>

      <Connector label={`${worked.code} carries down to every site`} />

      <div className="grid gap-2 lg:grid-cols-3">
        {worked.sites.map((row) => (
          <SiteBlock key={row.site} row={row} />
        ))}
      </div>

      <Connector label="each site writes its own tactics, plans and actions" />

      <div className="rounded-xl bg-background/40 px-3 py-2.5 text-[15px] leading-snug text-muted-foreground">
        <b className="text-foreground">Actions roll back up.</b> Tick the actions, the plan delivers, the strategy moves,
        the objective lands, the goal is met. That is the whole sheet.
      </div>
    </div>
  );
}