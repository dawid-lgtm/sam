import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

export const productsQuery = {
  queryKey: ["products"],
  queryFn: async () => {
    const page = await base44.entities.Product.list({ sort: "sort", limit: 200 });
    return page.items;
  },
};

export const allCardsQuery = {
  queryKey: ["program-cards", "all"],
  queryFn: async () => {
    const page = await base44.entities.ProgramCard.list({ sort: "sort", limit: 500 });
    return page.items;
  },
};

export function useProducts() {
  const { data = [] } = useQuery(productsQuery);
  return data;
}

export function useAllCards() {
  const { data = [] } = useQuery(allCardsQuery);
  return data;
}

export const productCardsQuery = (productKey) => ({
  queryKey: ["program-cards", productKey],
  queryFn: async () => {
    const page = await base44.entities.ProgramCard.filter({ product_key: productKey }, { sort: "sort", limit: 500 });
    return page.items;
  },
});

export function slugKey(name) {
  return String(name || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}