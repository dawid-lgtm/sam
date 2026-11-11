// Customer statuses and the Customer progress fields a product can report on.
export const CUSTOMER_STATUSES = ["Prospect", "Onboarding", "Active", "Paused"];

export const PROGRESS_FIELD_OPTIONS = [
  { value: "", label: "No progress bar" },
  { value: "progress_sam", label: "Sam" },
  { value: "progress_ops", label: "Operations" },
  { value: "progress_maintenance", label: "Maintenance" },
  { value: "progress_strategy", label: "Strategy" },
];

// Fallback for products seeded before progress lived on the product record.
const LEGACY_PROGRESS = {
  operations: "progress_sam",
  maintenance: "progress_maintenance",
  strategy: "progress_strategy",
};

export function progressField(key) {
  return LEGACY_PROGRESS[key] || null;
}