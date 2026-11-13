import { useEffect, useState } from "react";

// Which client the administrator is working on, and which client a saved record belongs to.
const ACTIVE_KEY = "sam.active-customer";
const TENANT_KEY = "sam.tenant-id";
const EVENT = "sam-tenant-change";

const canStore = () => typeof window !== "undefined" && !!window.localStorage;

function read(key) {
  if (!canStore()) return "";
  try {
    return window.localStorage.getItem(key) || "";
  } catch {
    return "";
  }
}

function write(key, value) {
  if (!canStore()) return;
  try {
    if (value) window.localStorage.setItem(key, value);
    else window.localStorage.removeItem(key);
  } catch {
    // Nothing to do: the record still saves, it just will not carry the client.
  }
}

/** The client an administrator has selected to work on (desktop header switcher). */
export const activeCustomerId = () => read(ACTIVE_KEY);

/** The client the next saved record belongs to. Synchronous, so offline saves get it too. */
export const currentTenantId = () => read(TENANT_KEY);

/** The client a record this person creates belongs to: their own, or the administrator's selection. */
export function tenantId(user) {
  if (user?.role === "admin") return activeCustomerId() || user?.customer_id || "";
  return user?.customer_id || "";
}

/** Called whenever the signed-in person is known, so saves carry their client. */
export function rememberTenant(user) {
  write(TENANT_KEY, tenantId(user));
}

export function setActiveCustomerId(id) {
  write(ACTIVE_KEY, id);
  write(TENANT_KEY, id);
  if (typeof window !== "undefined") window.dispatchEvent(new Event(EVENT));
}

export function useActiveCustomer() {
  const [id, setId] = useState("");
  useEffect(() => {
    const sync = () => setId(activeCustomerId());
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return id;
}