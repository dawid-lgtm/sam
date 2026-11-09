import moment from "moment";

export const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
export const MONTH_LABELS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** Date of a Mon-Fri cell: week 1-4 within the month, day 1-5 (Mon-Fri). */
export function cellDate(year, monthIndex, week, day) {
  return moment.utc({ year, month: monthIndex, day: 1 }).add((week - 1) * 7 + (day - 1), "days");
}

export function meetingsInCell(meetings, week, day) {
  return meetings.filter((m) => (m.weeks || []).includes(week) && Number(m.day_of_week) === day);
}

export function timeLabel(meeting) {
  return `${meeting.start_time || "09:00"} · ${meeting.duration_min} min`;
}

export function relevantMeetings(meetings, user) {
  if (user?.site_id) {
    return meetings.filter((m) => m.scope === "Head office" || m.site_id === user.site_id);
  }
  return meetings.filter((m) => m.scope === "Head office");
}

/** The next dated occurrence from `from`, or null. */
export function nextMeeting(meetings, from = moment.utc()) {
  let best = null;
  for (let offset = 0; offset < 15 && !best; offset++) {
    const base = from.clone().startOf("month").add(offset, "month");
    for (const meeting of meetings) {
      for (const week of meeting.weeks || []) {
        const d = cellDate(base.year(), base.month(), week, Number(meeting.day_of_week));
        const [h, min] = (meeting.start_time || "09:00").split(":").map(Number);
        d.hour(h).minute(min);
        if (d.isAfter(from) && (!best || d.isBefore(best.date))) best = { meeting, date: d };
      }
    }
  }
  return best;
}

export function dateLabel(d) {
  return d.format("ddd D MMM");
}