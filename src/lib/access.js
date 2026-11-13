export const ACCESS_LABELS = {
  administrator: "Administrator",
  executive: "Executive",
  project_manager: "Project Manager",
  project_lead: "Project Lead",
  site_lead: "Site Lead",
  supervisor: "Supervisor",
  superintendent: "Superintendent",
  facilitator: "Facilitator",
};

// The roles that live in the Managing Operations field coach.
export const OPS_ROLES = ["supervisor", "superintendent", "facilitator"];

export function isOpsRole(user) {
  return OPS_ROLES.includes(user?.access);
}

export function accessLabel(user) {
  return ACCESS_LABELS[user?.access] || "No access set";
}

// Goal, objectives, strategies and the change log belong to the top of the house.
export function canEditStrategy(user) {
  // A Project Lead completes the steps; the administrator reviews the quality.
  return ["administrator", "executive", "project_lead"].includes(user?.access);
}

// Tactics, plans, actions and tracker rows belong to the site team.
export function canEditSite(user, siteId) {
  if (!user) return false;
  if (user.access === "administrator") return true;
  if (user.access === "project_manager" || user.access === "site_lead") {
    return !!siteId && user.site_id === siteId;
  }
  return false;
}

export function isAdministrator(user) {
  return user?.access === "administrator";
}

/** Shared message when a save is refused because the account is not an app administrator. */
export function notifySaveError(err) {
  const message = String(err?.message || "").toLowerCase();
  if (message.includes("permission") || message.includes("403")) {
    return "Only app administrators can change this. Ask an administrator to give your account app-admin rights.";
  }
  return "Could not save. Please try again.";
}