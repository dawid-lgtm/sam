import { useEffect, useState } from "react";

const LINES = [
  "Well structured common sense",
  "Leadership without management is performance without direction",
  "Management without leadership undermines culture",
];

// The brand line under the logo cycles: each line fades in, waits, then fades out.
export function AuthTagline() {
  const [index, setIndex] = useState(0);
  const [shown, setShown] = useState(true);

  useEffect(() => {
    const fade = setTimeout(() => setShown(false), 3200);
    const next = setTimeout(() => {
      setIndex((i) => (i + 1) % LINES.length);
      setShown(true);
    }, 3700);
    return () => {
      clearTimeout(fade);
      clearTimeout(next);
    };
  }, [index]);

  return (
    <div className="mt-4 flex min-h-[3.25rem] items-center justify-center">
      <p
        className={`mx-auto max-w-sm text-center text-[15px] leading-snug text-foreground transition-all duration-500 ${
          shown ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"
        }`}
      >
        {LINES[index]}
      </p>
    </div>
  );
}