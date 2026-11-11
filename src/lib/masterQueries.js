import { format } from "date-fns";
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

/** Open safety tasks across every customer site: total, due in the next 7 days, overdue. */
export const safetyCountsQuery = {
  queryKey: ["safety-counts"],
  queryFn: async () => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const weekEnd = new Date(start);
    weekEnd.setDate(weekEnd.getDate() + 7);
    const today = format(start, "yyyy-MM-dd");
    const inAWeek = format(weekEnd, "yyyy-MM-dd");
    const open = { status: { $ne: "Done" } };

    const [active, dueThisWeek, overdue] = await Promise.all([
      base44.entities.SafetyTask.count(open),
      base44.entities.SafetyTask.count({ ...open, due_date: { $gte: today, $lte: inAWeek } }),
      base44.entities.SafetyTask.count({ ...open, due_date: { $lt: today } }),
    ]);
    return { active, dueThisWeek, overdue };
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