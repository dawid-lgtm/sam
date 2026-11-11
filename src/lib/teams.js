// Which team delivers a customer's work. The Raptortech team page shows only
// customers explicitly tagged to the Raptortech team; the master page shows all.
export const TEAMS = ["Raptortech team", "Another team"];
export const RAPTORTECH_TEAM = TEAMS[0];

export function isRaptortech(customer) {
  return customer?.delivered_by === RAPTORTECH_TEAM;
}