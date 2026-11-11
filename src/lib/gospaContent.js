/** Video slots — paste a hosted mp4 URL beside a key and the player appears. */
export const GOSPA_VIDEOS = {};

export const GOSPA_LAYERS = [
  {
    key: "g",
    letter: "G",
    name: "Goal",
    heading: "An effective Goal",
    what: "One sentence that says where the business is going over the next few years, in words a supervisor can repeat from memory.",
    criteria: [
      "A destination, not an activity: what the business looks like when it is won.",
      "Short enough to say in one breath, and specific enough that two leaders describe success the same way.",
      "Something people can picture. People act on a picture, not on a percentage.",
      "Fixed. It changes only by the executive, in the open, and the change is logged.",
    ],
    delivers: "Nothing sits above the Goal. It is the reference every Objective is tested against.",
    watch: "If it could describe any mine in the country, it is not a Goal. 'Be the best' can be neither delivered nor refused.",
    where: "Written at the top of this page.",
  },
  {
    key: "o",
    letter: "O",
    name: "Objectives",
    heading: "An effective Objective",
    what: "What must become true in the business for the Goal to happen. Five at most, because more than five cannot be owned.",
    criteria: [
      "An outcome, not a task: the business is different, not that an activity ran.",
      "Measurable at the end: a success metric with a baseline and a target, so agreement is not an opinion.",
      "Owned by one named ELT member, with a deliver date.",
      "Independent of each other, and together enough to actually deliver the Goal.",
    ],
    delivers:
      "Each Objective delivers a share of the Goal. If every Objective is met and the Goal still is not, an Objective was missing.",
    watch:
      "'Improve communication' has no end state, so it can never be finished. 'Every shift starts with a signed block plan on all four sites by 30 June' can.",
    where: "This page, in the Objectives list.",
  },
  {
    key: "s",
    letter: "S",
    name: "Strategies",
    heading: "An effective Strategy",
    what: "The chosen approach to one Objective: the few things the business will do about it, and what it will stop doing.",
    criteria: [
      "A choice. If it does not say what you are not doing, it is a wish list.",
      "Designed as a group in the workshop, so no site invents a competing version of it.",
      "An owner from the wider leadership team, a success metric, a value in volume or dollars, and a deliver date.",
      "Each site that owns a share is named, because only those sites write Plans against it.",
    ],
    delivers:
      "A Strategy delivers its Objective by producing the outcome that Objective measures. One Objective can carry several Strategies, and one Strategy can serve more than one site.",
    watch: "A Strategy that cannot be refused at a meeting is not a Strategy. 'Improve the culture' cannot be refused, so nothing can be tested.",
    where: "Strategy → Strategies.",
    to: "/strategy/strategies",
  },
  {
    key: "p",
    letter: "P",
    name: "Plans",
    heading: "An effective Plan",
    what: "The site's answer to its share of a Strategy: who does what, where and when, on this site.",
    criteria: [
      "Smaller than a Strategy and belonging to one site. If two sites must agree on it, it is a Strategy.",
      "Names a person and a date, not a team and 'ongoing'.",
      "Says where it happens: which crew, which area, which shift.",
      "Readable at the site meeting without anyone explaining it.",
    ],
    delivers: "A Plan delivers the Strategy by turning the site's share into work the site can actually schedule.",
    watch: "A Plan with no date cannot be late, and so it cannot be followed either.",
    where: "Each site's page.",
    to: "/site",
  },
  {
    key: "a",
    letter: "A",
    name: "Actions",
    heading: "An effective Action",
    what: "The next concrete step under a Plan. One name, one date, one verb.",
    criteria: [
      "One person. Two names means nobody.",
      "One date, in the register, visible at the site meeting and again at the regional one.",
      "Small enough to finish inside the review cycle.",
      "Ticked or re-dated in the open. Overdue is shown, not hidden.",
    ],
    delivers: "Actions deliver the Plan. They are the only level that moves between meetings, which is why the register is read at both.",
    watch: "An Action with no Plan behind it is busy work. It keeps meetings full and the Strategy exactly where it was.",
    where: "Site pages, tracked in the Action register.",
    to: "/strategy/actions",
  },
];