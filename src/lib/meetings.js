import moment from "moment";

export const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
export const MONTH_LABELS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/**
 * The Monday-to-Friday weeks of a month, each starting on a real Monday.
 * Week 1 is the Monday on or before the 1st; if that week holds no weekday
 * of this month, the first week starts a week later.
 */
export function monthWeekStarts(year, monthIndex) {
  const first = moment.utc({ year, month: monthIndex, day: 1 });
  const mondayOffset = (first.day() + 6) % 7; // Sunday = 0 in moment
  let start = first.clone().subtract(mondayOffset, "days");
  if (start.clone().add(4, "days").isBefore(first, "day")) start = start.add(7, "days");

  const monthEnd = first.clone().endOf("month");
  const starts = [];
  while (!start.isAfter(monthEnd, "day") && starts.length < 6) {
    starts.push(start.clone());
    start = start.clone().add(7, "days");
  }
  return starts;
}

/** The date in a week/day cell. week is 1-based, day 1 = Monday. */
export function cellDate(year, monthIndex, week, day) {
  const starts = monthWeekStarts(year, monthIndex);
  const start = starts[Math.min(Math.max(week, 1), starts.length) - 1] || starts[0];
  return start ? start.clone().add(day - 1, "days") : moment.utc({ year, month: monthIndex, day: 1 });
}

export function meetingsInCell(meetings, week, day) {
  return meetings.filter((m) => (m.weeks || []).includes(week) && Number(m.day_of_week) === day);
}

export function timeLabel(meeting) {
  return `${meeting.start_time || "09:00"} · ${meeting.duration_min} min`;
}

/** "Office weekly", "North Pit monthly" — no initials, no truncation. */
export function meetingChip(meeting) {
  const place = meeting.scope === "Head office" ? "Office" : String(meeting.site_name || "").replace(" Underground", "");
  const weekly = (meeting.weeks || []).length >= 3;
  return `${place || meeting.title} ${weekly ? "weekly" : "monthly"}`;
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
    const weekCount = monthWeekStarts(base.year(), base.month()).length;
    for (const meeting of meetings) {
      const weeks = meeting.weeks || [];
      for (const week of weeks) {
        if (week > weekCount) continue;
        const d = cellDate(base.year(), base.month(), week, Number(meeting.day_of_week));
        if (d.month() !== base.month()) continue;
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