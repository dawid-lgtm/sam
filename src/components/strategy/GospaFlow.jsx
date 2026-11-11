import { Link } from "@tanstack/react-router";
import { ChevronRight, PlayCircle } from "lucide-react";
import { GOSPA_LAYERS, GOSPA_VIDEOS } from "@/lib/gospaContent";

export function GospaFlow({ activeKey, onSelect }) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-1">
        {GOSPA_LAYERS.map((l, i) => {
          const active = l.key === activeKey;
          return (
            <div key={l.key} className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onSelect(l.key)}
                title={l.heading}
                className={`flex min-h-[48px] items-center gap-2 rounded-xl px-3 py-2 text-[15px] font-semibold transition ${
                  active ? "bg-gold text-gold-foreground" : "bg-background/50 text-foreground hover:bg-background/70"
                }`}
              >
                <span
                  className={`grid h-6 w-6 place-items-center rounded-md font-heading text-[14px] ${
                    active ? "bg-gold-foreground/15 text-gold-foreground" : "bg-gold text-gold-foreground"
                  }`}
                >
                  {l.letter}
                </span>
                {l.name}
              </button>
              {i < GOSPA_LAYERS.length - 1 ? (
                <ChevronRight className={`h-4 w-4 ${active ? "text-gold" : "text-muted-foreground"}`} />
              ) : null}
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-[14px] text-muted-foreground">
        Read left to right. Each level answers the one before it. Tap a level to see what makes it effective.
      </p>
    </div>
  );
}

function VideoSlot({ src }) {
  if (!src) return null;
  return (
    <div className="mt-3 overflow-hidden rounded-xl bg-background/60">
      <video src={src} controls playsInline className="w-full" />
    </div>
  );
}

export function GospaDetail({ layer, build }) {
  if (!layer) return null;
  return (
    <div className="mt-3 rounded-xl bg-background/40 p-3">
      <h3 className="font-heading text-[18px] font-semibold text-foreground">{layer.heading}</h3>
      <p className="mt-1 text-[15px] leading-snug text-foreground">{layer.what}</p>

      <p className="mt-3 text-[14px] font-semibold uppercase tracking-wide text-muted-foreground">What makes it effective</p>
      <ul className="mt-1.5 space-y-1.5">
        {layer.criteria.map((c) => (
          <li key={c} className="flex items-start gap-2 text-[15px] leading-snug text-foreground">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
            <span>{c}</span>
          </li>
        ))}
      </ul>

      <p className="mt-3 rounded-lg bg-background/60 p-2.5 text-[15px] leading-snug text-foreground">
        <span className="text-muted-foreground">How it delivers: </span>
        {layer.delivers}
      </p>

      <p className="mt-2 text-[15px] leading-snug text-muted-foreground">
        <span className="font-semibold text-foreground">Watch for: </span>
        {layer.watch}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-[14px] text-muted-foreground">In the app: {layer.where}</span>
        {layer.to ? (
          <Link
            to={layer.to}
            className="inline-flex min-h-[40px] items-center rounded-lg bg-gold px-3 text-[14px] font-semibold text-gold-foreground"
          >
            Open
          </Link>
        ) : null}
      </div>

      {build}

      {GOSPA_VIDEOS[layer.key] ? (
        <VideoSlot src={GOSPA_VIDEOS[layer.key]} />
      ) : (
        <p className="mt-3 flex items-start gap-2 text-[14px] leading-snug text-muted-foreground">
          <PlayCircle className="mt-0.5 h-4 w-4 shrink-0 text-gold" />A walkthrough video for this level is being made and will appear here.
        </p>
      )}
    </div>
  );
}