// The products a customer can be given. Flip a status to "available" to turn it on
// everywhere (pickers, program matrix, reports) without any other change.
export const PRODUCT_GROUPS = [
  {
    id: "mine-in-a-box",
    name: "Mine in a Box",
    items: [
      {
        key: "enterprise",
        name: "Enterprise Fundamentals",
        description: "The business fundamentals every site leader is held to",
        status: "available",
        progress_field: "progress_ops",
      },
      {
        key: "safety",
        name: "Safety Sam",
        description: "Safety leadership: the routine and the behaviours that keep people safe",
        status: "available",
      },
      {
        key: "strategy",
        name: "Strategy Sam",
        description: "Cascading GOSPA: goals, strategies and tactics, plans and actions",
        status: "available",
        progress_field: "progress_strategy",
        kind: "strategy",
      },
    ],
  },
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