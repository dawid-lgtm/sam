import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { authQuery } from "@/lib/AuthContext";

export const cardProgressKey = (productKey) => ["card-progress", productKey];

export function useCardProgress(productKey) {
  const queryClient = useQueryClient();
  const { data: auth } = useQuery(authQuery);
  const userId = auth?.user?.id;
  // Progress belongs to the person signed in — never read someone else's row.
  const key = [...cardProgressKey(productKey), userId];

  const query = useQuery({
    queryKey: key,
    enabled: !!productKey && !!userId,
    queryFn: async () => {
      const page = await base44.entities.CardProgress.filter(
        { product_key: productKey, created_by_id: userId },
        { limit: 1 }
      );
      return page.items?.[0] || null;
    },
  });

  const save = async (patch) => {
    const current = queryClient.getQueryData(key);
    const saved = current
      ? await base44.entities.CardProgress.update(current.id, patch)
      : await base44.entities.CardProgress.create({ product_key: productKey, ...patch });
    queryClient.setQueryData(key, saved);
    return saved;
  };

  return { record: query.data ?? null, isLoading: query.isLoading, save };
}