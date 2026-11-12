import { CloudOff, RefreshCw } from "lucide-react";
import { useOffline } from "@/lib/useOffline";

// The one line the person sees underground: signal is gone, their work is safe,
// and how much is still waiting to go up.
export function OfflineStatus() {
  const { offline, pending, rejected, syncing, sync } = useOffline();

  if (!offline && !pending && !rejected) return null;

  return (
    <div className="relative mx-auto w-full max-w-3xl px-4 pt-3">
      <div
        className={`flex flex-wrap items-center gap-x-2 gap-y-1.5 rounded-xl px-3 py-2 text-[15px] ${
          offline ? "bg-gold/20 ring-1 ring-gold" : "sam-glass"
        }`}
      >
        {offline ? (
          <CloudOff className="h-5 w-5 shrink-0 text-gold" />
        ) : (
          <RefreshCw className={`h-5 w-5 shrink-0 ${syncing ? "animate-spin text-gold" : "text-muted-foreground"}`} />
        )}

        <p className="min-w-0 flex-1 leading-snug">
          {offline
            ? pending
              ? `No signal. ${pending} change${pending === 1 ? "" : "s"} held on this device until you are back in coverage.`
              : "No signal. Keep working — what you save stays on this device until you are back in coverage."
            : syncing
              ? "Syncing what this device held…"
              : `${pending} change${pending === 1 ? "" : "s"} on this device, ready to sync.`}
        </p>

        {!offline && pending && !syncing ? (
          <button
            onClick={sync}
            className="min-h-[36px] shrink-0 rounded-lg bg-gold px-2.5 text-[14px] font-semibold text-gold-foreground"
          >
            Sync now
          </button>
        ) : null}
      </div>

      {rejected ? (
        <p className="mt-1 px-1 text-[14px] leading-snug text-muted-foreground">
          {rejected} change{rejected === 1 ? "" : "s"} could not be saved by the app and {rejected === 1 ? "was" : "were"}{" "}
          dropped. Check {rejected === 1 ? "it" : "them"} when you have signal.
        </p>
      ) : null}
    </div>
  );
}