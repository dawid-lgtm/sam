export const ACCESS_LABELS = {
  administrator: "Administrator",
  executive: "Executive",
  project_manager: "Project Manager",
  site_lead: "Site Lead",
};

export function accessLabel(user) {
  return ACCESS_LABELS[user?.access] || "No access set";
}

// Goal, objectives, strategies and the change log belong to the top of the house.
export function canEditStrategy(user) {
  return user?.access === "administrator" || user?.access === "executive";
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