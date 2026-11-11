// Everything Sam sells sits under one heading: Products. Each one is the same Sam
// system, just a different delivery pathway. Flip a status to "later" to hide it
// from switching on anywhere (pickers, program design, reports).
export const PRODUCT_GROUPS = [
  {
    id: "products",
    name: "Products",
    items: [
      {
        key: "operations",
        name: "Managing Operations",
        description:
          "One way to run the production shift, the day, the week and the month, so the plan made is the plan run.",
        for_whom: "Supervisors, Superintendents, Operations Managers, Project Managers, dispatch",
        inside:
          "The four blocks; The Superintendent's day; The number and PADAL; The plan and the reviews; Workbooks and cards; The Production Audit.",
        status: "available",
        progress_field: "progress_sam",
      },
      {
        key: "maintenance",
        name: "Managing Maintenance",
        description:
          "The same operating system for the maintenance shift, from the workshop floor to the storeroom.",
        for_whom: "Maintenance supervisors, Superintendents, planners, storepersons, Maintenance Managers",
        inside:
          "The four blocks; The Superintendent's day; Planning and scheduling; Review and Improve; Storeroom Operations; The audit and workbooks.",
        status: "available",
        progress_field: "progress_maintenance",
      },
      {
        key: "strategy",
        name: "Managing Strategy",
        description:
          "A strategy the whole business can run: the Goal held above, the site writing its own way to it.",
        for_whom:
          "Executives, General Managers, Operations Managers, Project Managers, Superintendents, department managers",
        inside:
          "GOSTPA; Annual Business Planning; Site Strategies and Tactics; The Strategy Review; The enterprise rhythm; The Strategy Audit.",
        status: "available",
        progress_field: "progress_strategy",
      },
      {
        key: "finance",
        name: "Managing Finance: The Keys to the Vault",
        description:
          "The keys to the vault: how a contract mining site makes and loses money, and the decisions that protect the margin.",
        for_whom: "Managers, Superintendents and supervisors",
        inside:
          "The value drivers; The number; Claims and contract management; The circuit, not the truck; Variations.",
        status: "available",
      },
      {
        key: "people_risk",
        name: "Managing People and Risk",
        description:
          "The statutory layer, the five HRO principles in the workflow, human factors, conflict and critical thinking, and the competency framework.",
        for_whom: "Every leader, from supervisor to manager",
        inside:
          "The statutory layer; The five HRO principles; Human factors; Conflict and critical thinking; The competency framework.",
        status: "available",
      },
      {
        key: "training",
        name: "Frontline Manager Training",
        description:
          "Stand-alone training that makes supervisors and Superintendents confident managers of the shift.",
        for_whom: "Supervisors and Superintendents",
        inside:
          "Prime workbooks; The Labs; Apply and Verify; Coaching cards; Behaviours and functions.",
        status: "available",
      },
      {
        key: "masterclasses",
        name: "Master Classes and Tools",
        description:
          "Three master classes run on site, and the Tools pack every shift and review runs on.",
        for_whom: "Every leader",
        inside:
          "Handling conflict with integrity; Critical thinking; Reading the mine; The Tools pack; PADAL and ROPE; The reports.",
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