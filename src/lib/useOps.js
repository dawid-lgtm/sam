import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";
import { cachedOps, loadOps } from "@/lib/opsStore";
import { isNetworkError } from "@/lib/offline";

/** The signed-in person plus everything their Field Coach screen needs for today. */
export function useOps() {
  const { user, isLoadingAuth } = useAuth();
  const query = useQuery({
    queryKey: ["ops", user?.id],
    enabled: !isLoadingAuth && !!user,
    queryFn: async () => {
      try {
        return await loadOps(user);
      } catch (error) {
        const cached = cachedOps(user);
        if (cached && isNetworkError(error)) return cached;
        throw error;
      }
    },
  });

  return {
    user,
    isLoadingAuth,
    isLoading: isLoadingAuth || query.isLoading,
    data: query.data || null,
    error: query.error,
    refresh: query.refetch,
  };
}

/** Training is locked until the Validation Lab is complete. */
export function fieldCoachUnlocked(data) {
  if (!data?.enrolment) return false;
  if (data.enrolment.lab_completed_at) return true;
  return ["Apply", "Verify", "Complete"].includes(data.enrolment.stage);
}

export function trainingStage(data) {
  if (!data?.enrolment) return "Not enrolled";
  if (fieldCoachUnlocked(data)) return data.enrolment.stage;
  return "Prime";
}