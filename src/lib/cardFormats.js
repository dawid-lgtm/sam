export const CARD_FORMATS = [
  { key: "text", label: "Text", hint: "A plain written card", body_label: "The text", needsOptions: false },
  { key: "video", label: "Video", hint: "A video with a caption", body_label: "Caption", needsOptions: false },
  { key: "question", label: "Question", hint: "They answer in their own words", body_label: "Question", needsOptions: false },
  { key: "multiple_choice", label: "Multiple choice", hint: "One answer from a list", body_label: "Question", needsOptions: true },
  { key: "upload", label: "Upload", hint: "Question plus a photo or document", body_label: "What they upload, and why", needsOptions: false },
  { key: "quiz", label: "Quiz", hint: "Multiple choice with a right answer", body_label: "Question", needsOptions: true },
  { key: "poll", label: "Poll", hint: "A quick vote, no right answer", body_label: "Poll question", needsOptions: true },
];

export function formatMeta(key) {
  return CARD_FORMATS.find((f) => f.key === key) || CARD_FORMATS[0];
}