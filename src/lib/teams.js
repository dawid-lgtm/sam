// Which team delivers a customer's work. The Raptortech team page shows only
// customers delivered by the Raptortech team.
export const TEAMS = ["Raptortech team", "Another team"];
export const RAPTORTECH_TEAM = TEAMS[0];

export function isRaptortech(customer) {
  return (customer?.delivered_by || RAPTORTECH_TEAM) === RAPTORTECH_TEAM;
}