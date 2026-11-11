export const DEPLOYMENT_PLANS = {
  strategy: {
    intro:
      "Three steps. Defining the Goal and the Objectives sits with the CEO and the ELT; threshing them out and defining the Strategies is the full-day leadership workshop; casting to site turns Strategies into Tactics, Plans and Actions. Smaller companies often run steps 1 and 2 as one event.",
    phases: [
      {
        n: 1,
        name: "Defining the Goals and Objectives",
        status: "CEO and ELT, usually an offsite",
        description:
          "The handbook is reviewed and the frame set: one three year Goal, up to five Objectives that must be true for it, and one ELT owner on each. The leadership workshop is dated before anyone leaves the room.",
        blocks: [
          {
            h: "Review the handbook",
            items: [
              "The Managing Strategy handbook, issued at enrolment, walked through",
              "The Time Usage Model confirmed",
            ],
          },
          {
            h: "Set the frame",
            items: [
              "The three year Goal confirmed or designed",
              "Up to five Objectives designed to deliver it",
            ],
          },
          {
            h: "Appoint and date",
            items: [
              "One ELT member owns each Objective",
              "The date set for the full-day leadership workshop",
            ],
          },
        ],
        gate: [
          "Goal confirmed or designed",
          "No more than five Objectives, each with one executive owner",
          "Time Usage Model confirmed",
          "Leadership workshop dated",
        ],
      },
      {
        n: 2,
        name: "Threshing the Goals and Objectives and defining the Strategies",
        status: "Full day, Ops Managers, GMs and PMs",
        description:
          "The Goal and Objectives are threshed out with the wider leadership group, then the Strategies that will deliver them are designed together, each with an owner and a value. Roles are confirmed and the ON the business rhythm is locked for twelve months.",
        blocks: [
          {
            h: "Goal and Objectives",
            items: [
              "The Goal presented to the wider leadership group",
              "The Objectives presented and reviewed",
            ],
          },
          {
            h: "Strategies, roles, handbooks",
            items: [
              "Strategies designed as a group to deliver the Objectives",
              "Handbooks reviewed by the new levels of the business",
              "Roles and accountability confirmed",
            ],
          },
          {
            h: "Lock the rhythm",
            items: [
              "The head office monthly ON the business meeting, dated for 12 months",
              "The six-monthly strategy and performance review, off site, dated",
            ],
          },
        ],
        gate: [
          "Every Objective has Strategies, each with an owner and a value",
          "Roles and accountability confirmed for the new levels",
          "Monthly ON the business meetings dated for 12 months",
          "Six-monthly strategy and performance review dated",
        ],
      },
      {
        n: 3,
        name: "Casting to site",
        status: "Project Managers, coached by Ops and GMs",
        description:
          "Each site casts its share: Tactics to deliver the Strategies, Plans saying who does what and where, and Actions with a name and a date. The handbook is issued and the site ON the business meeting sits before the head office one.",
        blocks: [
          {
            h: "Site translation",
            items: [
              "Tactics the site will use to deliver the Strategies",
              "Plans: who, what, where, when",
              "Actions: a name and a date",
            ],
          },
          {
            h: "Cascade the handbook",
            items: [
              "The Managing Strategy handbook issued to the site leadership team",
              "Superintendents, and mine managers where that layer exists",
            ],
          },
          {
            h: "Hold the rhythm",
            items: [
              "The site ON the business meeting, in the week or days before the head office one",
              "ELT checks the sites are adhering to the rhythm",
              "Ops Managers and GMs coach the PMs; attendance mandatory",
            ],
          },
        ],
        gate: [
          "Every Strategy has a Tactic on site, with an owner and a trigger",
          "Every Plan has a who, what, where and when; every Action a name and a date",
          "Site leadership teams hold the handbook and the rhythm",
          "The site ON meeting sits before the head office ON meeting",
        ],
      },
    ],
    rhythm: {
      title: "The ON the business rhythm Managing Strategy locks in",
      note: "Each site's ON the business meeting sits in the week, or a couple of days, before the head office ON the business meeting, because one informs the other. The three weekly site reviews that precede it are the Enterprise Foundations rhythm.",
      rows: [
        {
          who: "At site (PM, coached by the Ops Manager or GM)",
          cells: ["IN · Weekly site review", "IN · Weekly site review", "IN · Weekly site review", "ON · ON the business (half a day)"],
        },
        {
          who: "Head office (CEO and ELT)",
          cells: ["ON · ON the business, five key questions", "IN · Executive hour", "IN · Executive hour", "IN · Executive hour"],
        },
      ],
      onIndex: { 0: [3], 1: [0] },
    },
    streams: [
      {
        name: "Step 1 · Defining the Goals and Objectives",
        steps: [
          ["Handbook reviewed: Goal, Objectives, Strategies, Tactics, Plans, Actions", "CEO, ELT"],
          ["Time Usage Model confirmed", "CEO, ELT"],
          ["Three year Goal confirmed or designed", "CEO, ELT"],
          ["Up to five Objectives designed to deliver the Goal", "CEO, ELT"],
          ["One ELT member appointed as owner of each Objective", "CEO"],
          ["Leadership workshop dated, with Ops Managers, GMs and PMs invited", "CEO"],
          ["The offsite usually facilitated by the Decision Architecture Group; no fixed duration", "Decision Architecture Group"],
        ],
      },
      {
        name: "Step 2 · Threshing them out and defining the Strategies",
        steps: [
          ["Goal presented to the wider leadership group", "CEO"],
          ["Objectives presented and reviewed", "ELT owners"],
          ["Strategies designed as a group, one owner and a value each", "ELT, Ops Managers, GMs, PMs"],
          ["Handbooks reviewed by the new levels of the business", "New levels of leadership"],
          ["Roles and accountability confirmed", "ELT, GMs"],
          ["Head office monthly ON the business meetings locked, 12 months", "CEO, COO"],
          ["Six-monthly strategy and performance review offsite dated", "COO"],
        ],
      },
      {
        name: "Step 3 · Casting to site",
        steps: [
          ["Project Manager returns to site, supported by the Ops Manager or GM", "Project Manager"],
          ["Tactics written: what the site will do to deliver each Strategy", "Project Manager, site leadership"],
          ["Plans written: who, what, where, when", "Project Manager"],
          ["Actions written: a name and a date", "Project Manager"],
          ["Handbook issued to superintendents, and mine managers where they exist", "Project Manager"],
          ["Site ON the business meeting held before the head office one", "Project Manager"],
          ["Ops Manager or GM in attendance to guide and coach, mandatory", "Ops Manager, GM"],
          ["ELT checks every site is adhering to the rhythm", "ELT"],
        ],
      },
    ],
  },
};