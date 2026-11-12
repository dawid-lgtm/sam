import { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { OFFLINE_EVENT, flush, isOffline, readQueue, readRejected } from "@/lib/offline";

const snapshot = () => ({ offline: isOffline(), pending: readQueue().length, rejected: readRejected() });

// Signal, how much is waiting on this device, and the sync itself.
export function useOffline() {
  const queryClient = useQueryClient();
  const [state, setState] = useState({ offline: false, pending: 0, rejected: 0, syncing: false });

  const sync = useCallback(async () => {
    const now = snapshot();
    if (now.offline || !now.pending) {
      setState((s) => ({ ...s, ...now }));
      return;
    }
    setState((s) => ({ ...s, ...now, syncing: true }));
    const synced = await flush();
    setState((s) => ({ ...s, ...snapshot(), syncing: false }));
    if (synced) queryClient.invalidateQueries({ queryKey: ["sam-data"] });
  }, [queryClient]);

  useEffect(() => {
    setState((s) => ({ ...s, ...snapshot() }));
    const onChange = () => setState((s) => ({ ...s, ...snapshot() }));
    const onOnline = () => sync();
    const onOffline = () => onChange();
    window.addEventListener(OFFLINE_EVENT, onChange);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    sync();
    return () => {
      window.removeEventListener(OFFLINE_EVENT, onChange);
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, [sync]);

  return { ...state, sync };
}