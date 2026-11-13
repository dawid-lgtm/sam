import { useState } from "react";
import { Camera, FileText } from "lucide-react";
import { signedUrl, uploadEvidence } from "@/lib/opsStore";

/** Photos are stored privately (stored privately) and opened through a short-lived signed link. */
export function PhotoStrip({ photos = [], onChange, lineNo }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const add = async (file) => {
    setBusy(true);
    setError("");
    try {
      const evidence = await uploadEvidence(file);
      onChange([...photos, lineNo ? { ...evidence, line_no: String(lineNo) } : evidence]);
    } catch {
      setError("Could not add the photo. Try again when you have signal.");
    } finally {
      setBusy(false);
    }
  };

  const open = async (fileUri) => {
    try {
      const url = await signedUrl(fileUri);
      window.open(url, "_blank", "noopener");
    } catch {
      setError("Could not open the photo.");
    }
  };

  const shown = lineNo ? photos.filter((p) => String(p.line_no) === String(lineNo)) : photos;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <label className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-xl bg-secondary px-3 text-[15px] font-medium text-foreground">
          <Camera className="h-4 w-4" />
          {busy ? "Adding photo…" : "Add photo"}
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            disabled={busy}
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (file) add(file);
            }}
          />
        </label>
        {shown.map((p, i) => (
          <button
            key={`${p.file_uri}-${i}`}
            type="button"
            onClick={() => open(p.file_uri)}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-background/50 px-2.5 text-[14px] text-foreground"
          >
            <FileText className="h-4 w-4 text-gold" />
            Photo {i + 1}
          </button>
        ))}
      </div>
      {error ? <p className="mt-1.5 text-[14px] text-foreground">{error}</p> : null}
    </div>
  );
}