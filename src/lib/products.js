// Everything Sam sells sits under one heading: Products. Each one is the same Sam
// system, just a different delivery pathway. Flip a status to "later" to hide it
// from switching on anywhere (pickers, program matrix, reports).
export const PRODUCT_GROUPS = [
  {
    id: "products",
    name: "Products",
    items: [
      {
        key: "enterprise",
        name: "Enterprise Fundamentals",
        description: "The business fundamentals every site leader is held to",
        status: "available",
        progress_field: "progress_ops",
      },
      {
        key: "strategy",
        name: "Managing Strategy",
        description: "Cascading GOSPA: goals, strategies and tactics, plans and actions",
        status: "available",
        progress_field: "progress_strategy",
      },
      {
        key: "operations",
        name: "Managing Operations",
        description: "Running the month: the work, the numbers and the review that keeps them true",
        status: "available",
        progress_field: "progress_sam",
      },
      {
        key: "maintenance",
        name: "Managing Maintenance",
        description: "Keeping the plant and the equipment doing what the plan needs",
        status: "available",
        progress_field: "progress_maintenance",
      },
      {
        key: "people_risk",
        name: "Managing People and Risk",
        description: "Safety, behaviours and the leadership that keeps people well",
        status: "available",
      },
      {
        key: "finance",
        name: "Managing Finance: The Keys to the Vault",
        description: "Reading the money and owning the decisions it drives",
        status: "available",
      },
      {
        key: "training",
        name: "Managing Training",
        description: "Building the crew's capability on purpose, not by accident",
        status: "available",
      },
    ],
  },
];

export const ALL_PRODUCTS = PRODUCT_GROUPS.flatMap((group) =>
  group.items.map((item) => ({ ...item, group: group.name })),
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