import { base44 } from "@/api/base44Client";
import { progressField } from "@/lib/products";

export const customersQuery = {
  queryKey: ["customers"],
  queryFn: () => base44.entities.Customer.list(),
};

export const sitesQuery = {
  queryKey: ["sites-set-up"],
  queryFn: () => base44.entities.Site.list(),
};

export const toolsQuery = {
  queryKey: ["tools"],
  queryFn: () => base44.entities.Tool.list(),
};

export const appUsersQuery = {
  queryKey: ["app-users"],
  queryFn: () => base44.entities.User.list(),
};

export const safetyTasksQuery = {
  queryKey: ["safety-tasks"],
  queryFn: () => base44.entities.SafetyTask.list({ limit: 500 }),
  select: (page) => page.items || [],
};

/** Safety task counts: designed (all) and implemented (done), optionally one team's customers. */
export const safetyCountsQuery = safetyCountsFor();

export function safetyCountsFor(customerIds) {
  const scope = customerIds ? { customer_id: { $in: customerIds } } : {};
  return {
    queryKey: ["safety-counts", customerIds ? customerIds.join(",") : "all"],
    queryFn: async () => {
      const [designed, implemented] = await Promise.all([
        base44.entities.SafetyTask.count(scope),
        base44.entities.SafetyTask.count({ ...scope, status: "Done" }),
      ]);
      return { designed, implemented };
    },
  };
}

export const fourBlockDaysQuery = {
  queryKey: ["four-block-days"],
  queryFn: () => base44.entities.FourBlockDay.list({ limit: 500 }),
  select: (page) => page.items || [],
};

/** Four-block shift counts by role, optionally one team's customers. */
export const fourBlockCountsQuery = fourBlockCountsFor();

export function fourBlockCountsFor(customerIds) {
  const scope = customerIds ? { customer_id: { $in: customerIds } } : {};
  return {
    queryKey: ["four-block-counts", customerIds ? customerIds.join(",") : "all"],
    queryFn: async () => {
      const [total, supervisors, superintendents] = await Promise.all([
        base44.entities.FourBlockDay.count(scope),
        base44.entities.FourBlockDay.count({ ...scope, role: "Supervisor" }),
        base44.entities.FourBlockDay.count({ ...scope, role: "Superintendent" }),
      ]);
      return { total, supervisors, superintendents };
    },
  };
}

export function byName(a, b) {
  return String(a.name || a.title || "").localeCompare(String(b.name || b.title || ""));
}

export function averageProgress(customer, keys, products = []) {
  const values = keys
    .map((key) => {
      const field = products.find((p) => p.key === key)?.progress_field || progressField(key);
      return field ? Number(customer?.[field] || 0) : null;
    })
    .filter((v) => v !== null);
  if (!values.length) return null;
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}