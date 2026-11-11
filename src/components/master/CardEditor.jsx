import { useState } from "react";
import { formatMeta } from "@/lib/cardFormats";
import { TextField, TextAreaField, SelectField, PrimaryButton, GhostButton } from "@/components/ui-kit/controls";

const parseOptions = (text) =>
  String(text || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

export function CardEditor({ card, saving, onSave, onCancel }) {
  const meta = formatMeta(card.format);
  const [title, setTitle] = useState(card.title || "");
  const [body, setBody] = useState(card.body || "");
  const [mediaUrl, setMediaUrl] = useState(card.media_url || "");
  const [uploadKind, setUploadKind] = useState(card.upload_kind || "both");
  const [optionsText, setOptionsText] = useState((card.options || []).join("\n"));
  const [correct, setCorrect] = useState(card.correct_option || "");

  const options = parseOptions(optionsText);

  const submit = (e) => {
    e.preventDefault();
    onSave({
      title: title.trim(),
      body,
      media_url: meta.key === "video" ? mediaUrl.trim() : "",
      upload_kind: meta.key === "upload" ? uploadKind : "both",
      options: meta.needsOptions ? options : [],
      correct_option: meta.key === "quiz" && options.includes(correct) ? correct : "",
    });
  };

  return (
    <form className="space-y-4" onSubmit={submit}>
      <TextField
        label="Card name"
        hint="For you, in the chain — participants see the card itself."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={`e.g. Day 1 ${meta.label.toLowerCase()}`}
      />

      {meta.key === "video" ? (
        <TextField label="Video link" value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} placeholder="https://…" />
      ) : null}

      <TextAreaField
        label={meta.body_label}
        rows={meta.key === "text" ? 6 : 3}
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />

      {meta.needsOptions ? (
        <TextAreaField
          label="Options"
          hint="One per line."
          rows={4}
          value={optionsText}
          onChange={(e) => setOptionsText(e.target.value)}
          placeholder={"Option one\nOption two"}
        />
      ) : null}

      {meta.key === "quiz" ? (
        <SelectField
          label="Right answer"
          value={correct}
          onChange={(e) => setCorrect(e.target.value)}
          options={options.map((o) => ({ value: o, label: o }))}
          placeholder="Pick the right answer"
        />
      ) : null}

      {meta.key === "upload" ? (
        <SelectField
          label="What they can upload"
          value={uploadKind}
          onChange={(e) => setUploadKind(e.target.value)}
          options={[
            { value: "image", label: "A photo" },
            { value: "document", label: "A document" },
            { value: "both", label: "A photo or a document" },
          ]}
        />
      ) : null}

      <div className="flex gap-2">
        <PrimaryButton type="submit" className="flex-1" disabled={saving}>
          {saving ? "Saving…" : card.id ? "Save card" : "Add card"}
        </PrimaryButton>
        <GhostButton type="button" onClick={onCancel}>
          Cancel
        </GhostButton>
      </div>
    </form>
  );
}