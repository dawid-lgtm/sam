import { DEFAULT_BLOCK_TIMES, STEPS } from "@/lib/opsContent";

export function toMinutes(hhmm) {
  if (!hhmm) return 0;
  const [h, m] = String(hhmm).split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

export function toClock(minutes) {
  const m = ((Math.round(minutes) % 1440) + 1440) % 1440;
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

export const shiftClock = (hhmm, dayNight, offset = 12) =>
  dayNight === "Night" ? toClock(toMinutes(hhmm) + offset * 60) : hhmm || "";

export function todayISO(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export const nowMinutes = () => {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
};

export const blockTimes = (setting) =>
  setting?.block_times?.length === 4 ? setting.block_times : DEFAULT_BLOCK_TIMES;

const offset = (setting) => Number(setting?.night_offset_hours ?? 12);

/** The nine-step day, with each step's window and Superintendent meeting, in the shift's own clock. */
export function stepsFor(setting, dayNight = "Day") {
  const off = offset(setting);
  const t = (hhmm) => shiftClock(hhmm, dayNight, off);
  const times = blockTimes(setting);
  const windows = {
    handover: { start: t(setting?.handover_time || "05:00"), end: toClock(toMinutes(t(setting?.handover_time || "05:00")) + Number(setting?.handover_minutes ?? 30)) },
    prestart: { start: t(setting?.prestart_time || "06:00"), end: toClock(toMinutes(t(setting?.prestart_time || "06:00")) + Number(setting?.prestart_minutes ?? 15)) },
    b1: { start: t(times[0].start), end: t(times[0].end), meeting: times[0].meeting, meeting_time: t(times[0].meeting_time) },
    b2: { start: t(times[1].start), end: t(times[1].end), meeting: times[1].meeting, meeting_time: t(times[1].meeting_time) },
    b3: { start: t(times[2].start), end: t(times[2].end), meeting: times[2].meeting, meeting_time: t(times[2].meeting_time) },
    b4: { start: t(times[3].start), end: t(times[3].end), meeting: times[3].meeting, meeting_time: t(times[3].meeting_time) },
    report: { start: t(times[3].start), end: t(setting?.report_due_time || "16:00") },
    handover_out: { start: t(setting?.handover_out_time || "17:00"), end: toClock(toMinutes(t(setting?.handover_out_time || "17:00")) + 30) },
  };
  return STEPS.map((s) => ({ ...s, ...windows[s.id] }));
}

/** Not started · Due · Done · Late, from the record and the clock. */
export function stepStatus(step, record, now = nowMinutes()) {
  if (record?.status === "Done") return "Done";
  if (record?.status === "Missed") return "Missed";
  const start = toMinutes(step.start);
  const end = toMinutes(step.end);
  const dayWrap = end < start;
  const inWindow = dayWrap ? now >= start || now <= end : now >= start && now <= end;
  if (inWindow) return "Due";
  if (!dayWrap && now > end) return "Late";
  if (dayWrap && now > end && now < start) return "Late";
  return "Not started";
}

/** The step the phone should put in front of the person now. */
export function currentStep(steps, records, now = nowMinutes()) {
  const statuses = steps.map((s) => ({ step: s, status: stepStatus(s, records[s.id], now) }));
  return (
    statuses.find((s) => s.status === "Due") ||
    statuses.find((s) => s.status === "Late") ||
    statuses.find((s) => s.status === "Not started") ||
    statuses[statuses.length - 1]
  );
}

export function minutesLeft(step, now = nowMinutes()) {
  const end = toMinutes(step.end);
  const diff = end - now;
  if (diff <= 0) return "Time is up";
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  return h ? `${h}h ${m}m left` : `${m}m left`;
}

/** Tool 1: the arithmetic the app does for the supervisor. */
export function workoutNumber({ volume, payload, diggingHours, trucks, bucketsLoad }) {
  const loads = volume && payload ? volume / payload : 0;
  const loadsHr = loads && diggingHours ? loads / diggingHours : 0;
  const loadsTruckHr = loadsHr && trucks ? loadsHr / trucks : 0;
  const buckets = loads && bucketsLoad ? loads * bucketsLoad : 0;
  const bucketsMin = buckets && diggingHours ? buckets / (diggingHours * 60) : 0;
  const secsBucket = bucketsMin ? 60 / bucketsMin : 0;
  return {
    loads: Math.round(loads),
    loadsHr: Number(loadsHr.toFixed(1)),
    loadsTruckHr: Number(loadsTruckHr.toFixed(1)),
    bucketsMin: Number(bucketsMin.toFixed(2)),
    secsBucket: Math.round(secsBucket),
  };
}

export function numberSentence(result, unit) {
  if (!result.loads) return "";
  return `We need ${result.loads} loads this shift: that is ${result.loadsHr} an hour, ${result.loadsTruckHr} per truck per hour, and a bucket every ${result.secsBucket} seconds. (Volume in ${unit || "bcm"}.)`;
}

export function blockTargets(loads) {
  if (!loads) return [];
  const each = Math.floor(loads / 4);
  const rest = loads - each * 4;
  return [0, 1, 2, 3].map((i) => each + (i < rest ? 1 : 0));
}