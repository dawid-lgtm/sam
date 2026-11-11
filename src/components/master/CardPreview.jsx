import { formatMeta } from "@/lib/cardFormats";

const UPLOAD_LABEL = {
  image: "a photo",
  document: "a document",
  both: "a photo or a document",
};

export function CardPreview({ card }) {
  const meta = formatMeta(card.format);
  const options = card.options || [];

  return (
    <div className="rounded-xl bg-background/40 p-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-gold px-2 py-0.5 text-[13px] font-semibold text-gold-foreground">{meta.label}</span>
        {card.title ? <p className="text-[15px] font-semibold leading-snug">{card.title}</p> : null}
      </div>

      {card.format === "video" && card.media_url ? (
        <video src={card.media_url} controls className="mt-2 w-full rounded-lg" />
      ) : null}

      {card.body ? <p className="mt-2 whitespace-pre-wrap text-[15px] leading-snug">{card.body}</p> : null}

      {meta.needsOptions && options.length ? (
        <ul className="mt-2 space-y-1">
          {options.map((option, i) => {
            const right = card.format === "quiz" && card.correct_option === option;
            return (
              <li key={i} className={`rounded-lg px-2.5 py-1.5 text-[14px] ${right ? "bg-gold font-semibold text-gold-foreground" : "bg-card"}`}>
                {option}
                {right ? " · right answer" : ""}
              </li>
            );
          })}
        </ul>
      ) : null}

      {card.format === "question" ? (
        <p className="mt-2 rounded-lg border border-dashed border-foreground/40 px-2.5 py-2 text-[14px] text-muted-foreground">
          They write their answer here
        </p>
      ) : null}

      {card.format === "upload" ? (
        <p className="mt-2 rounded-lg border border-dashed border-foreground/40 px-2.5 py-2 text-[14px] text-muted-foreground">
          They add {UPLOAD_LABEL[card.upload_kind] || UPLOAD_LABEL.both} here
        </p>
      ) : null}
    </div>
  );
}