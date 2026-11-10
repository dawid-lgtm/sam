// The products a customer can be given. Flip a status to "available" to turn it on
// everywhere (pickers, program matrix, reports) without any other change.
export const PRODUCT_GROUPS = [
  {
    id: "platform",
    name: "Platform",
    items: [
      {
        key: "sam",
        name: "SAM App Platform",
        description: "Online platform that guides users through the CML process",
        status: "available",
        progress_field: "progress_sam",
      },
      {
        key: "lms",
        name: "LMS (Raptor Tech)",
        description: "Learning Management System",
        status: "available",
      },
    ],
  },
  {
    id: "cml",
    name: "Mine in a Box Suite",
    items: [
      {
        key: "ops",
        name: "Managing Operations",
        description: "Full CML training program (Enterprise Fundamentals for Ops)",
        status: "available",
        progress_field: "progress_ops",
      },
      {
        key: "maint",
        name: "Managing Maintenance",
        description: "Full CML training program (Enterprise Fundamentals for Maintenance)",
        status: "available",
        progress_field: "progress_maintenance",
      },
      {
        key: "safety",
        name: "Managing Safety",
        description: "Full CML training program",
        status: "later",
      },
      {
        key: "training",
        name: "Managing Training",
        description: "Full CML training program",
        status: "later",
      },
      {
        key: "sales_finance",
        name: "Sales and Finances",
        description: "Full program",
        status: "later",
      },
    ],
  },
  {
    id: "strategy",
    name: "Strategy",
    items: [
      {
        key: "strategy",
        name: "Managing Strategy",
        description: "Cascading GOSPA process (Goals → Strategies & Tactics → Plans & Actions)",
        status: "available",
        progress_field: "progress_strategy",
        kind: "strategy",
      },
    ],
  },
];

export const ALL_PRODUCTS = PRODUCT_GROUPS.flatMap((group) =>
  group.items.map((item) => ({ ...item, group: group.name, kind: item.kind || "program" })),
);

export function productByKey(key) {
  return ALL_PRODUCTS.find((p) => p.key === key) || null;
}

export function productName(key) {
  return productByKey(key)?.name || key;
}

export function progressField(key) {
  return productByKey(key)?.progress_field || null;
}

export function progressFor(customer, key) {
  const field = progressField(key);
  return field ? Number(customer?.[field] || 0) : null;
}

export const CUSTOMER_STATUSES = ["Prospect", "Onboarding", "Active", "Paused"];