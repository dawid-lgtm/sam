import { base44 } from "@/api/base44Client";

// Anything saved while the phone has no signal goes in this queue on the device,
// and is replayed against the app once the phone is back in coverage.
const QUEUE_KEY = "sam.offline.queue.v1";
const CACHE_KEY = "sam.offline.cache.v1";
const REJECTED_KEY = "sam.offline.rejected.v1";

export const OFFLINE_EVENT = "sam-offline-change";

// Entity name -> the key it is read under in the app's data set.
const LIST_KEY = {
  CompanySetting: "company",
  Objective: "objectives",
  Strategy: "strategies",
  Site: "sites",
  ObjectiveChangeLog: "changeLog",
  Meeting: "meetings",
  StrategyTracker: "trackers",
  Tactic: "tactics",
  Plan: "plans",
  SiteAction: "actions",
  SiteAsk: "asks",
};

const canStore = () => typeof window !== "undefined" && !!window.localStorage;

function read(key, fallback) {
  if (!canStore()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  if (!canStore()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // The device is full: nothing more we can do but keep what is already there.
  }
}

function emit() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(OFFLINE_EVENT));
}

export const isOffline = () => typeof navigator !== "undefined" && navigator.onLine === false;

export function isNetworkError(error) {
  if (!error) return false;
  if (isOffline()) return true;
  if (error.name === "TypeError") return true;
  return /failed to fetch|network|offline|load failed|connection|timed out/i.test(error.message || "");
}

export const readQueue = () => read(QUEUE_KEY, []);
export const readRejected = () => read(REJECTED_KEY, 0);
export const readCache = () => read(CACHE_KEY, null);

export function saveCache(data) {
  if (data) write(CACHE_KEY, data);
}

// The last data the phone saw, with everything waiting to sync laid over the top,
// so a screen opened underground still shows the work the person just did.
export function applyQueue(data) {
  const queue = readQueue();
  if (!data || !queue.length) return data;
  const out = { ...data };

  queue.forEach((entry) => {
    if (entry.entity === "CompanySetting") {
      out.company = { ...(out.company || {}), ...entry.data };
      return;
    }
    const key = LIST_KEY[entry.entity];
    if (!key) return;
    const list = [...(out[key] || [])];
    if (entry.op === "create") {
      list.push({ ...entry.data, id: entry.localId, pending: true });
    } else if (entry.op === "update") {
      const i = list.findIndex((r) => r.id === entry.id);
      if (i >= 0) list[i] = { ...list[i], ...entry.data };
    } else if (entry.op === "delete") {
      out[key] = list.filter((r) => r.id !== entry.id);
      return;
    }
    out[key] = list;
  });

  return out;
}

// Create, update or delete a record. Straight to the app when there is signal,
// kept on the device when there is not.
export async function saveOffline(entity, op, { id, data } = {}) {
  if (!isOffline()) {
    try {
      if (op === "create") return await base44.entities[entity].create(data);
      if (op === "update") return await base44.entities[entity].update(id, data);
      return await base44.entities[entity].delete(id);
    } catch (error) {
      if (!isNetworkError(error)) throw error;
    }
  }

  const queue = readQueue();
  const isLocal = String(id || "").startsWith("local-");

  // A record written on the device but not yet synced: fold the change into its create.
  if (isLocal && (op === "update" || op === "delete")) {
    const next =
      op === "delete"
        ? queue.filter((e) => e.localId !== id)
        : queue.map((e) => (e.localId === id ? { ...e, data: { ...e.data, ...data } } : e));
    write(QUEUE_KEY, next);
    emit();
    return { id, ...(data || {}), pending: true };
  }

  const localId = `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  queue.push({ localId, entity, op, id, data, at: new Date().toISOString() });
  write(QUEUE_KEY, queue);
  emit();
  return { id: id || localId, ...(data || {}), pending: true };
}

let flushing = false;

// Replays the queue in order. A signal that drops mid-way stops it and keeps the rest.
export async function flush() {
  if (flushing || isOffline()) return 0;
  flushing = true;
  let synced = 0;
  try {
    let queue = readQueue();
    while (queue.length) {
      const entry = queue[0];
      let refused = false;
      try {
        if (entry.op === "create") await base44.entities[entry.entity].create(entry.data);
        else if (entry.op === "update") await base44.entities[entry.entity].update(entry.id, entry.data);
        else await base44.entities[entry.entity].delete(entry.id);
      } catch (error) {
        if (isNetworkError(error)) break;
        refused = true;
      }
      queue = queue.slice(1);
      write(QUEUE_KEY, queue);
      if (refused) write(REJECTED_KEY, readRejected() + 1);
      else synced += 1;
      emit();
    }
  } finally {
    flushing = false;
  }
  return synced;
}