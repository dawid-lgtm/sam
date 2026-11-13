import { base44 } from "@/api/base44Client";
import { isNetworkError, saveOffline } from "@/lib/offline";
import { tenantId } from "@/lib/tenant";
import { todayISO } from "@/lib/opsShift";

const CACHE_KEY = "sam.ops.cache.v1";

const canStore = () => typeof window !== "undefined" && !!window.localStorage;

function readCache() {
  if (!canStore()) return null;
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeCache(data) {
  if (!canStore()) return;
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // A full phone is not a reason to stop the shift.
  }
}

export function latestEnrolment(enrolments) {
  return [...(enrolments || [])].sort((a, b) =>
    String(b.updated_date || "").localeCompare(String(a.updated_date || "")),
  )[0] || null;
}

export async function loadOps(user) {
  const [enrolments, settings] = await Promise.all([
    base44.entities.OpsEnrolment.filter({ user_id: user.id }),
    user.site_id ? base44.entities.ShiftSetting.filter({ site_id: user.site_id }) : Promise.resolve([]),
  ]);
  const enrolment = latestEnrolment(enrolments);
  const cohort = enrolment?.cohort_id
    ? await base44.entities.OpsCohort.get(enrolment.cohort_id).catch(() => null)
    : null;
  const setting = settings[0] || null;
  const shifts = await base44.entities.Shift.filter({ user_id: user.id, date: todayISO() });
  const shift = shifts[0] || null;

  const data = { enrolment, cohort, setting, shift, records: {}, numbers: null, blocks: [], report: null, openNotes: [] };

  if (shift?.id) {
    const [handovers, prestarts, blocks, reports, numbers, notes] = await Promise.all([
      base44.entities.HandoverRecord.filter({ shift_id: shift.id }),
      base44.entities.PrestartRecord.filter({ shift_id: shift.id }),
      base44.entities.BlockReport.filter({ shift_id: shift.id }),
      base44.entities.ShiftReport.filter({ shift_id: shift.id }),
      base44.entities.NumberWorkout.filter({ shift_id: shift.id }),
      base44.entities.CoachingNote.filter({ shift_id: shift.id }),
    ]);
    data.records = {
      handover: handovers.find((r) => r.direction === "In") || null,
      handover_out: handovers.find((r) => r.direction === "Out") || null,
      prestart: prestarts[0] || null,
      b1: blocks.find((b) => Number(b.block_no) === 1) || null,
      b2: blocks.find((b) => Number(b.block_no) === 2) || null,
      b3: blocks.find((b) => Number(b.block_no) === 3) || null,
      b4: blocks.find((b) => Number(b.block_no) === 4) || null,
      report: reports[0] || null,
    };
    data.blocks = blocks;
    data.report = reports[0] || null;
    data.numbers = numbers[0] || null;
    data.openNotes = notes;
  }

  writeCache({ ...data, cachedAt: new Date().toISOString(), user_id: user.id });
  return data;
}

/** The last data this phone saw, so a screen opened underground still works. */
export function cachedOps(user) {
  const cached = readCache();
  if (!cached || cached.user_id !== user?.id) return null;
  return cached;
}

export async function createShift(user, setting, dayNight) {
  const payload = {
    customer_id: tenantId(user),
    site_id: user.site_id || setting?.site_id || "",
    site_name: setting?.site_name || "",
    user_id: user.id,
    user_name: user.full_name || user.email || "",
    date: todayISO(),
    day_night: dayNight,
    superintendent_id: user.superintendent_id || "",
    steps: {},
    started_at: new Date().toISOString(),
  };
  return saveOffline("Shift", "create", { data: payload });
}

export async function saveStep(user, record, step, payload) {
  const base = {
    customer_id: tenantId(user),
    site_id: user.site_id || "",
    shift_id: step.shift.id,
    user_id: user.id,
    ...payload,
  };
  if (record?.id) return saveOffline(step.entity, "update", { id: record.id, data: base });
  return saveOffline(step.entity, "create", { data: base });
}

export async function saveNumber(user, record, shift, payload) {
  const base = { customer_id: tenantId(user), site_id: user.site_id || "", shift_id: shift.id, user_id: user.id, ...payload };
  if (record?.id) return saveOffline("NumberWorkout", "update", { id: record.id, data: base });
  return saveOffline("NumberWorkout", "create", { data: base });
}

export async function updateShift(shift, patch) {
  return base44.entities.Shift.update(shift.id, patch);
}

export function isOfflineError(error) {
  return isNetworkError(error);
}

/** Private evidence: the file itself lives in private storage, not a public link. */
export async function uploadEvidence(file) {
  const { file_uri } = await base44.integrations.Core.UploadPrivateFile({ file });
  return { file_uri, taken_at: new Date().toISOString(), caption: "" };
}

export async function signedUrl(fileUri) {
  const { signed_url } = await base44.integrations.Core.CreateFileSignedUrl({ file_uri: fileUri, expires_in: 300 });
  return signed_url;
}