import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { applyQueue, isNetworkError, isOffline, readCache, saveCache } from "@/lib/offline";

const bySort = (a, b) => (a.sort ?? 0) - (b.sort ?? 0);

async function loadFromApp() {
  const [companies, objectives, strategies, sites, changeLog, meetings, trackers, tactics, plans, actions, asks] =
    await Promise.all([
      base44.entities.CompanySetting.list(),
      base44.entities.Objective.list(),
      base44.entities.Strategy.list(),
      base44.entities.Site.list(),
      base44.entities.ObjectiveChangeLog.list(),
      base44.entities.Meeting.list(),
      base44.entities.StrategyTracker.list(),
      base44.entities.Tactic.list(),
      base44.entities.Plan.list(),
      base44.entities.SiteAction.list(),
      base44.entities.SiteAsk.list(),
    ]);

  return {
    company: companies[0] || null,
    objectives: [...objectives].sort(bySort),
    strategies: [...strategies].sort(bySort),
    sites: [...sites].sort(bySort),
    changeLog: [...changeLog].sort((a, b) => String(b.log_date).localeCompare(String(a.log_date))),
    meetings: [...meetings].sort(bySort),
    trackers,
    tactics: [...tactics].sort(bySort),
    plans: [...plans].sort(bySort),
    actions: [...actions].sort(bySort),
    asks,
  };
}

export function useSamData() {
  return useQuery({
    queryKey: ["sam-data"],
    queryFn: async () => {
      const cached = readCache();

      // No signal: the phone answers from the last data it saw, plus its own unsynced work.
      if (isOffline() && cached) return applyQueue(cached);

      try {
        const data = await loadFromApp();
        saveCache(data);
        return applyQueue(data);
      } catch (error) {
        if (cached && isNetworkError(error)) return applyQueue(cached);
        throw error;
      }
    },
  });
}

export function useRefreshSam() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["sam-data"] });
}