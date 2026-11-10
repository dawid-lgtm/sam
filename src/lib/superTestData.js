// TEST DATA ONLY. Made-up companies and people. Program outlines are placeholders
// until each step list is confirmed against the Mine in a box knowledge base.

export const companies = [
  { id: "c1", name: "Test Mining Co", sites: ["North Pit (test)", "South Pit (test)"], admin: "Ava Chen (test)", programs: ["ops", "strategy"] },
  { id: "c2", name: "Sample Resources (test)", sites: ["East Mine (test)"], admin: "Sam Lee (test)", programs: ["strategy", "safety"] },
];

export const masterPrograms = [
  { id: "ops", name: "Managing Operations", short: "Ops", steps: ["Workbook (Learn)", "Lab", "Apply", "Validation Lab", "Verify: observed shift"] },
  { id: "maint", name: "Managing Maintenance", short: "Maint", steps: ["Workbook (Learn)", "Lab", "Apply", "Validation Lab", "Verify"] },
  { id: "strategy", name: "Managing Strategy", short: "Strategy", steps: ["Self-assessment", "Goal, objectives, strategies", "Site tactics, plans, actions", "Monthly strategy review", "Verify"] },
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
  { person: "John Carter (test)", job: "Superintendent", company: "Test Mining Co", site: "North Pit (test)", program: "ops", step: 2 },
  { person: "Mia Ross (test)", job: "Supervisor", company: "Test Mining Co", site: "North Pit (test)", program: "ops", step: 1 },
  { person: "Liam Hart (test)", job: "Supervisor", company: "Test Mining Co", site: "South Pit (test)", program: "ops", step: 0 },
  { person: "John Carter (test)", job: "Superintendent", company: "Test Mining Co", site: "North Pit (test)", program: "strategy", step: 1 },
  { person: "Ava Chen (test)", job: "Site Project Manager", company: "Test Mining Co", site: "South Pit (test)", program: "strategy", step: 2 },
  { person: "Noah Reid (test)", job: "Superintendent", company: "Sample Resources (test)", site: "East Mine (test)", program: "strategy", step: 0 },
  { person: "Sam Lee (test)", job: "Operations Manager", company: "Sample Resources (test)", site: "East Mine (test)", program: "safety", step: 1 },
];
