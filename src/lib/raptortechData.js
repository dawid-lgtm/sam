// The Raptortech team's own customer portfolio and delivery calendar.
export const RAPTORTECH_CUSTOMERS = [
  {
    id: "rt-kestrel",
    name: "Kestrel Underground",
    site: "Kestrel mine · WA Goldfields",
    status: "Active",
    program: "Raptortech Training",
    progress: 78,
    people: 34,
    lead: "Project lead · D. Falck",
    next: "2026-11-18",
    note: "Frontline cadence running, module 3 booked for the whole crew.",
  },
  {
    id: "rt-beacon",
    name: "Beacon Hill Open Pit",
    site: "Beacon Hill · WA Midwest",
    status: "Active",
    program: "Frontline Manager Training",
    progress: 62,
    people: 28,
    lead: "Project lead · R. Mensah",
    next: "2026-11-20",
    note: "Superintendent reviews locked in every second Thursday.",
  },
  {
    id: "rt-redplains",
    name: "Red Plains Copper",
    site: "Red Plains · SA",
    status: "Active",
    program: "Enterprise Fundamentals",
    progress: 91,
    people: 46,
    lead: "Project lead · K. Whitcombe",
    next: "2026-11-24",
    note: "Closing out the program, handover pack in draft.",
  },
  {
    id: "rt-ironbark",
    name: "Ironbark Ridge",
    site: "Ironbark · QLD",
    status: "Onboarding",
    program: "Senior Training",
    progress: 24,
    people: 12,
    lead: "Project lead · T. Nagle",
    next: "2026-11-25",
    note: "Site leads being briefed, first block starts next rotation.",
  },
  {
    id: "rt-dampier",
    name: "Dampier Salt Operations",
    site: "Dampier · WA Pilbara",
    status: "Active",
    program: "Master Classes and Tools",
    progress: 55,
    people: 31,
    lead: "Project lead · A. Petrov",
    next: "2026-12-02",
    note: "Four-block shift logs rolling out across both crews.",
  },
  {
    id: "rt-southern",
    name: "Southern Cross UG",
    site: "Southern Cross · WA",
    status: "Prospect",
    program: "Raptortech Training",
    progress: 8,
    people: 0,
    lead: "Project lead · J. Okafor",
    next: "2026-12-08",
    note: "Scoping visit booked with the mine manager.",
  },
];

export const RAPTORTECH_SESSIONS = [
  { id: "rs-1", date: "2026-11-18", title: "Frontline Manager · module 3", customer: "Kestrel Underground", mode: "On site" },
  { id: "rs-2", date: "2026-11-20", title: "Superintendent review", customer: "Beacon Hill Open Pit", mode: "Teams" },
  { id: "rs-3", date: "2026-11-24", title: "Program handover", customer: "Red Plains Copper", mode: "On site" },
  { id: "rs-4", date: "2026-11-25", title: "Senior Training · block 1", customer: "Ironbark Ridge", mode: "On site" },
  { id: "rs-5", date: "2026-12-02", title: "Master class · four-block shifts", customer: "Dampier Salt Operations", mode: "On site" },
];

export function shortDate(value) {
  if (!value) return "—";
  return new Date(`${value}T00:00:00Z`).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}