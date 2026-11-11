import { base44 } from "@/api/base44Client";
import { progressField } from "@/lib/products";

export const customersQuery = {
  queryKey: ["customers"],
  queryFn: () => base44.entities.Customer.list(),
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

/** Safety tasks across every customer site: designed (all) and implemented (done). */
export const safetyCountsQuery = {
  queryKey: ["safety-counts"],
  queryFn: async () => {
    const [designed, implemented] = await Promise.all([
      base44.entities.SafetyTask.count({}),
      base44.entities.SafetyTask.count({ status: "Done" }),
    ]);
    return { designed, implemented };
  },
};

export const fourBlockDaysQuery = {
  queryKey: ["four-block-days"],
  queryFn: () => base44.entities.FourBlockDay.list({ limit: 500 }),
  select: (page) => page.items || [],
};

/** Full shifts completed in four blocks across every customer site, split by role. */
export const fourBlockCountsQuery = {
  queryKey: ["four-block-counts"],
  queryFn: async () => {
    const [total, supervisors, superintendents] = await Promise.all([
      base44.entities.FourBlockDay.count({}),
      base44.entities.FourBlockDay.count({ role: "Supervisor" }),
      base44.entities.FourBlockDay.count({ role: "Superintendent" }),
    ]);
    return { total, supervisors, superintendents };
  },
};

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