export const GOSPA_SHEET = {
  goal: "Double free cash flow over three years without a single serious injury.",
  objectives: [
    { code: "O1", statement: "Lift development metres 20% across the group by December 2027." },
    { code: "O2", statement: "Halve unplanned downtime on the primary fleet by June 2027." },
    { code: "O3", statement: "Cut the total recordable injury frequency rate below 2.0 by June 2027." },
    { code: "O4", statement: "Hold cost per tonne flat at every site while volume grows 20%." },
    { code: "O5", statement: "Every supervisor running a four block day, every shift, by March 2027." },
  ],
  example: {
    code: "O1",
    statement: "Lift development metres 20% across the group by December 2027.",
    strategies: [
      {
        code: "S1",
        statement: "Run a five day development cycle at every site.",
        sites: [
          {
            site: "Creston underground",
            tactic: "Pre-split pattern on every lower bench face",
            plan: "Drill and blast crew, pattern by pattern, from February",
            action: "Trial pattern signed off · T. Hall · 15 Mar",
          },
          {
            site: "Kestrel underground",
            tactic: "Two bolting crews working face to face",
            plan: "Superintendent, both headings, nights included",
            action: "Second crew rostered · R. Ngata · 1 Apr",
          },
          {
            site: "Marlin open pit",
            tactic: "Trucks held to a fixed haul cycle board",
            plan: "Shift supervisor, every cycle, from March",
            action: "Cycle board live · J. Kerr · 8 Mar",
          },
        ],
      },
      {
        code: "S2",
        statement: "Pre-load ground support so no crew waits on mesh.",
      },
    ],
  },
};