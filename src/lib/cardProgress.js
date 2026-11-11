import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

export const cardProgressKey = (productKey) => ["card-progress", productKey];

export function useCardProgress(productKey) {
  const queryClient = useQueryClient();
  const key = cardProgressKey(productKey);

  const query = useQuery({
    queryKey: key,
    enabled: !!productKey,
    queryFn: async () => {
      const page = await base44.entities.CardProgress.filter({ product_key: productKey }, { limit: 1 });
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