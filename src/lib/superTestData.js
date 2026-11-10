// TEST DATA ONLY. Made-up companies and people. Program outlines are placeholders
// until each step list is confirmed against the Mine in a box knowledge base.

export const companies = [
  { id: "c1", name: "Pilbara Mining Co", sites: ["North Pit", "South Pit"], admin: "Ava Chen", programs: ["ops", "strategy"] },
  { id: "c2", name: "Sample Resources", sites: ["East Mine"], admin: "Sam Lee", programs: ["strategy", "safety"] },
];

export const masterPrograms = [
  { id: "ops", name: "Managing Operations", short: "Ops", steps: ["Workbook (Learn)", "Lab", "Apply", "Validation Lab", "Verify: observed shift"] },
  { id: "maint", name: "Managing Maintenance", short: "Maint", steps: ["Workbook (Learn)", "Lab", "Apply", "Validation Lab", "Verify"] },
  { id: "strategy", name: "Managing Strategy", short: "Strategy", steps: ["Goals and Objectives", "Briefing Workshop", "Regional Strategies and Tactics", "Site Tactics, Plans, Actions", "Monthly On the Business"] },
  { id: "safety", name: "Managing Safety", short: "Safety", steps: ["Workbook (Learn)", "Lab", "Apply", "Validation Lab", "Verify"] },
];

export const materials = [
  { id: "m1", type: "Workbook", title: "Superintendent workbook", program: "ops" },
  { id: "m2", type: "Handbook", title: "Superintendent's day handbook", program: "ops" },
  { id: "m3", type: "Audit", title: "Four-block audit", program: "ops" },
  { id: "m4", type: "Workbook", title: "Managing Strategy workbook", program: "strategy" },
  { id: "m5", type: "Handbook", title: "Managing Strategy handbook", program: "strategy" },
  { id: "m6", type: "Audit", title: "Strategy review audit", program: "strategy" },
  { id: "m7", type: "Workbook", title: "Maintenance workbook", program: "maint" },
  { id: "m8", type: "Workbook", title: "Safety workbook", program: "safety" },
];

export const enrolments = [
  { person: "John Carter", job: "Superintendent", company: "Pilbara Mining Co", site: "North Pit", program: "ops", step: 2 },
  { person: "Mia Ross", job: "Supervisor", company: "Pilbara Mining Co", site: "North Pit", program: "ops", step: 1 },
  { person: "Liam Hart", job: "Supervisor", company: "Pilbara Mining Co", site: "South Pit", program: "ops", step: 0 },
  { person: "John Carter", job: "Superintendent", company: "Pilbara Mining Co", site: "North Pit", program: "strategy", step: 1 },
  { person: "Ava Chen", job: "Site Project Manager", company: "Pilbara Mining Co", site: "South Pit", program: "strategy", step: 2 },
  { person: "Noah Reid", job: "Superintendent", company: "Sample Resources", site: "East Mine", program: "strategy", step: 0 },
  { person: "Sam Lee", job: "Operations Manager", company: "Sample Resources", site: "East Mine", program: "safety", step: 1 },
];