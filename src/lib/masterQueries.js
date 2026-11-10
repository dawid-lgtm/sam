import { base44 } from "@/api/base44Client";

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

export function byName(a, b) {
  return String(a.name || a.title || "").localeCompare(String(b.name || b.title || ""));
}

export function averageProgress(customer, keys) {
  const values = keys
    .map((key) => {
      const field = { sam: "progress_sam", ops: "progress_ops", maint: "progress_maintenance", strategy: "progress_strategy" }[key];
      return field ? Number(customer?.[field] || 0) : null;
    })
    .filter((v) => v !== null);
  if (!values.length) return null;
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}