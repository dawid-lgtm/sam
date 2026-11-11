export const DEPLOYMENT_PLANS = {
  strategy: {
    intro:
      "Enterprise first, one pilot in depth, then scale, then a business that corrects itself. Approval to enter each phase is decided on the evidence at the monthly review, never on a date.",
    phases: [
      {
        n: 1,
        name: "Enterprise foundations",
        status: "Finishing",
        blocks: [
          { h: "Capture the core", items: ["Tools, models, meetings and ownership captured", "Maturity mapped by site"] },
          { h: "Head office first", items: ["Reporting and measurement sorted at the top", "Roles, accountabilities and enterprise rhythms defined"] },
          { h: "Lock the frame", items: ["Goal and five Objectives approved", "One executive owner per Objective", "The Time Usage Model (TUM) defined"] },
          { h: "Senior training", items: ["GMs, Ops Managers and PMs: critical thinking and fiscal capability"] },
        ],
        gate: [
          "Goal and Objectives approved, each with one executive owner",
          "Roles and decision rights written for the enterprise rhythm",
          "TUM defined; the eight starter numbers agreed",
          "Senior training delivered",
          "ON meeting dates set for 12 months",
        ],
      },
      {
        n: 2,
        name: "Pilot and the strategic layer",
        status: "Starting",
        blocks: [
          {
            h: "Stream A: the pilot, in depth",
            items: [
              "Pilot sites together",
              "Workbooks to supervisors and superintendents, with online access",
              "Managing Operations Part A: the five stepping stones and the four blocks, every shift",
              "Site rhythm IN · IN · IN · ON",
            ],
          },
          {
            h: "Stream B: the enterprise rhythm",
            items: [
              "Regional IN · IN · IN · ON: the Friday executive hour, then the Monthly Regional Business Review (COO)",
              "Objective owners report health and value monthly",
              "Raptor Tech data into one monthly pack",
            ],
          },
        ],
        gate: [
          "Pilot sites: the four blocks run every shift; block cards signed; every No coached",
          "Weekly and Monthly Site Reviews to their cards, three months running",
          "Site GOSTPA cascades locked and returned monthly",
          "Regional Review four months running; returns to site within 3 days",
          "Monthly pack from Raptor Tech, plan figures loaded",
          "Verification audit run again at both sites",
        ],
      },
      {
        n: 3,
        name: "Scale",
        status: "Next",
        blocks: [
          { h: "Roll the proven pattern", items: ["Remaining sites deployed to the pattern proven at the pilot", "Managing Operations Part B and Managing Maintenance at the pilot sites"] },
          { h: "Capability", items: ["One operating language", "Leaders scored on their own forums"] },
          { h: "Fiscal", items: ["Every site's margin on one rhythm", "Commercial risk monthly", "First six-monthly Strategy Review"] },
        ],
        gate: [
          "Every site on the same rhythm, language and cards",
          "The enterprise model holds without the master admin in the room",
          "First six-monthly Strategy Review held; resources moved on evidence",
        ],
      },
      {
        n: 4,
        name: "Self-correcting",
        status: "Later",
        blocks: [
          { h: "The destination behaviour", items: ["Verification data drives monthly redesign", "Standards mature from use"] },
          { h: "Capability owned", items: ["Your own project leads certified; the capability owned in-house"] },
          { h: "Fiscal", items: ["Predictable margins across the portfolio"] },
        ],
        gate: [
          "Stage 2, ordered and professional, held at every site",
          "Stage 3 behaviours emerging: deviation surfaces itself; repeat causes leave as system findings",
        ],
      },
    ],
    rhythm: {
      title: "Phase 2 rhythm: three weeks IN, one half day ON",
      note: "Each site's Monthly Site Review sends its return to the Regional Review in week 1. The Regional Review's decisions reach each site within three days.",
      rows: [
        { who: "At site", cells: ["IN · Weekly Site Review", "IN · Weekly Site Review", "IN · Weekly Site Review", "ON · Monthly Site Review (half a day, site PM)"] },
        { who: "At region (head office)", cells: ["ON · Regional Business Review (half a day, COO)", "IN · Friday executive hour", "IN · Friday executive hour", "IN · Friday executive hour"] },
      ],
      onIndex: { 0: [3], 1: [0] },
    },
    streams: [
      {
        name: "Stream A · the pilot, in depth",
        steps: [
          ["Printing approval: Managing Operations Part A and the workbooks", "Operations Manager"],
          ["Validation Lab dates for supervisors and superintendents", "Operations Manager"],
          ["Workbooks issued, with the welcome letter and online access", "Customer admin, project lead"],
          ["Weekly Site Reviews (IN) on the new standard", "Project lead"],
          ["Site GOSTPA locked: each site Strategy with a number, a date and a value", "Project lead"],
          ["First Monthly Site Review (ON) at each site, half a day", "Customer admin, project lead"],
          ["Validation Lab: the five stepping stones, the four blocks and the decision rights", "Project lead"],
          ["Apply and Verify: the four blocks every shift; the Daily Site Review", "Superintendents"],
        ],
      },
      {
        name: "Stream B · the enterprise rhythm",
        steps: [
          ["One executive owner confirmed for each of the five Objectives", "CEO"],
          ["The Friday executive hour (IN), weekly", "COO, executive team"],
          ["First Monthly Regional Business Review (ON), half a day", "COO"],
          ["Objective owners report health and value, monthly", "Executive owners"],
          ["Each executive leader attends one Monthly Site Review at each pilot site", "ELT"],
          ["Raptor Tech: the eight starter numbers, then the automated pack", "Master admin"],
        ],
      },
    ],
  },
};