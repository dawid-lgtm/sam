import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Lock, Paperclip } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import { formatMeta } from "@/lib/cardFormats";
import { inputClass } from "@/components/ui-kit/controls";

function isComplete(card, answer, watched) {
  if (!card) return false;
  if (card.format === "video") return card.media_url ? !!watched : !!answer.read;
  if (card.format === "question") return !!(answer.text || "").trim();
  if (card.format === "upload") return !!answer.file_uri;
  if (["multiple_choice", "quiz", "poll"].includes(card.format)) return !!answer.choice;
  return !!answer.read;
}

function hintFor(card) {
  if (!card) return "";
  if (card.format === "video" && card.media_url) return "Watch the video to the end to unlock the next card.";
  if (card.format === "question") return "Write your answer to unlock the next card.";
  if (card.format === "upload") return "Add your file to unlock the next card.";
  if (["multiple_choice", "quiz", "poll"].includes(card.format)) return "Pick an answer to unlock the next card.";
  return "Read this card and tick it off to unlock the next card.";
}

export function CardRunner({ cards }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [watched, setWatched] = useState({});
  const [uploading, setUploading] = useState(false);
  const [finished, setFinished] = useState(false);

  const card = cards[index];
  const answer = answers[card?.id] || {};
  const done = isComplete(card, answer, watched[card?.id]);
  const last = index === cards.length - 1;
  const meta = card ? formatMeta(card.format) : null;

  const setAnswer = (patch) =>
    setAnswers((a) => ({ ...a, [card.id]: { ...(a[card.id] || {}), ...patch } }));

  const attach = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const { file_uri } = await base44.integrations.Core.UploadPrivateFile({ file });
      setAnswer({ file_uri, file_name: file.name });
    } catch {
      toast.error("That file did not upload. Try again.");
    } finally {
      setUploading(false);
    }
  };

  if (!cards.length) {
    return <p className="rounded-xl bg-background/40 p-4 text-[15px] text-muted-foreground">This chain has no cards yet.</p>;
  }

  if (finished) {
    return (
      <div className="rounded-xl bg-background/40 p-5 text-center">
        <Check className="mx-auto h-10 w-10 text-gold" />
        <p className="mt-2 font-heading text-[20px] font-semibold">Chain complete</p>
        <p className="mt-1 text-[15px] text-muted-foreground">All {cards.length} cards are done.</p>
        <button
          type="button"
          onClick={() => {
            setFinished(false);
            setIndex(0);
          }}
          className="mt-4 min-h-[48px] rounded-xl bg-secondary px-4 text-[15px] font-semibold"
        >
          Go back to day 1
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3">
        <div className="mb-1.5 flex items-baseline justify-between gap-2">
          <p className="text-[15px] font-semibold text-gold">Day {index + 1}</p>
          <p className="text-[14px] text-muted-foreground">of {cards.length}</p>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-background/50">
          <div className="h-full rounded-full bg-gold transition-all" style={{ width: `${((index + 1) / cards.length) * 100}%` }} />
        </div>
      </div>

      <div className="rounded-xl bg-background/40 p-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-gold px-2 py-0.5 text-[13px] font-semibold text-gold-foreground">{meta.label}</span>
          {card.title ? <p className="text-[16px] font-semibold leading-snug">{card.title}</p> : null}
        </div>

        {card.body ? <p className="mt-2 whitespace-pre-wrap text-[15px] leading-snug">{card.body}</p> : null}

        {card.format === "video" && card.media_url ? (
          <video
            src={card.media_url}
            controls
            onEnded={() => setWatched((w) => ({ ...w, [card.id]: true }))}
            onTimeUpdate={(e) => {
              const v = e.currentTarget;
              if (v.duration && v.currentTime >= v.duration - 0.5) setWatched((w) => ({ ...w, [card.id]: true }));
            }}
            className="mt-3 w-full rounded-lg"
          />
        ) : null}

        {["multiple_choice", "quiz", "poll"].includes(card.format) ? (
          <div className="mt-3 space-y-1.5">
            {(card.options || []).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setAnswer({ choice: option })}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-[15px] transition ${
                  answer.choice === option ? "bg-gold font-semibold text-gold-foreground" : "bg-card"
                }`}
              >
                {answer.choice === option ? <Check className="h-4 w-4 shrink-0" /> : null}
                {option}
              </button>
            ))}
          </div>
        ) : null}

        {card.format === "question" ? (
          <textarea
            rows={3}
            value={answer.text || ""}
            onChange={(e) => setAnswer({ text: e.target.value })}
            placeholder="Your answer"
            className={`${inputClass} mt-3`}
          />
        ) : null}

        {card.format === "upload" ? (
          <label className="mt-3 flex min-h-[48px] cursor-pointer items-center gap-2 rounded-xl border border-dashed border-foreground/40 px-3 py-2.5 text-[15px]">
            <Paperclip className="h-4 w-4 shrink-0" />
            <span className="truncate">{uploading ? "Uploading…" : answer.file_name || "Add a photo or document"}</span>
            <input
              type="file"
              className="sr-only"
              onChange={(e) => attach(e.target.files?.[0])}
            />
          </label>
        ) : null}

        {done ? (
          <p className="mt-3 flex items-center gap-1.5 text-[14px] font-semibold text-gold">
            <Check className="h-4 w-4" /> Card done
          </p>
        ) : ["text", "video"].includes(card.format) ? (
          <button
            type="button"
            onClick={() => setAnswer({ read: !answer.read })}
            className={`mt-3 flex min-h-[48px] w-full items-center gap-2 rounded-xl px-3 text-[15px] font-semibold transition ${
              answer.read ? "bg-gold text-gold-foreground" : "bg-secondary text-foreground"
            }`}
          >
            <Check className="h-4 w-4" /> {card.format === "video" && card.media_url ? "I have watched this video" : "I have read this card"}
          </button>
        ) : null}
      </div>

      {!done ? (
        <p className="mt-2 flex items-center gap-1.5 text-[14px] text-muted-foreground">
          <Lock className="h-3.5 w-3.5 shrink-0" /> {hintFor(card)}
        </p>
      ) : null}

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => setIndex((i) => i - 1)}
          disabled={index === 0}
          className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl bg-secondary px-4 text-[15px] font-semibold disabled:opacity-40"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <button
          type="button"
          onClick={() => (last ? setFinished(true) : setIndex((i) => i + 1))}
          disabled={!done}
          className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl bg-gold px-4 text-[15px] font-semibold text-gold-foreground disabled:opacity-40"
        >
          {last ? "Finish" : "Next card"} <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}