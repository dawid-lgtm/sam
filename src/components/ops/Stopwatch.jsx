import { useEffect, useRef, useState } from "react";
import { Timer, Play, Square, Flag } from "lucide-react";

const mmss = (seconds) => `${Math.floor(seconds / 60)}:${String(Math.round(seconds % 60)).padStart(2, "0")}`;

/** The in-app stopwatch for Block 3: start, lap, stop. Laps are saved with the block. */
export function Stopwatch({ laps = [], onChange }) {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const started = useRef(null);

  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => {
      if (started.current) setElapsed(Math.floor((Date.now() - started.current) / 1000));
    }, 500);
    return () => clearInterval(id);
  }, [running]);

  const start = () => {
    started.current = Date.now();
    setElapsed(0);
    setRunning(true);
  };
  const lap = () => {
    if (!elapsed) return;
    onChange([...laps, elapsed]);
    started.current = Date.now();
    setElapsed(0);
  };
  const stop = () => {
    setRunning(false);
    setElapsed(0);
    started.current = null;
  };

  return (
    <div className="rounded-xl bg-background/40 p-3">
      <p className="flex items-center gap-1.5 text-[15px] font-semibold text-foreground">
        <Timer className="h-4 w-4 text-gold" />
        {mmss(elapsed)}
      </p>
      <div className="mt-2 flex gap-1.5">
        <button type="button" onClick={start} className="min-h-[44px] flex-1 rounded-lg bg-gold px-2 text-[14px] font-semibold text-gold-foreground">
          <Play className="mr-1 inline h-4 w-4" />
          Start
        </button>
        <button type="button" onClick={lap} disabled={!running} className="min-h-[44px] flex-1 rounded-lg bg-secondary px-2 text-[14px] font-semibold text-foreground disabled:opacity-50">
          <Flag className="mr-1 inline h-4 w-4" />
          Lap
        </button>
        <button type="button" onClick={stop} disabled={!running} className="min-h-[44px] flex-1 rounded-lg bg-secondary px-2 text-[14px] font-semibold text-foreground disabled:opacity-50">
          <Square className="mr-1 inline h-4 w-4" />
          Stop
        </button>
      </div>
      {laps.length ? (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {laps.map((l, i) => (
            <span key={i} className="rounded-full bg-background px-2 py-0.5 text-[13px] text-foreground">
              {i + 1}: {mmss(l)}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}