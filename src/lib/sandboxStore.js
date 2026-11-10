import { useEffect, useState } from "react";

// TEST DATA ONLY. Sandbox for trying the programs end to end.
const KEY = "sam-sandbox-v1";

export const SANDBOX_PROGRAMS = [
  { id: "strategy", name: "Managing Strategy", short: "Strategy" },
  { id: "ops", name: "Managing Operations", short: "Ops" },
];

export const blankAdmins = {
  strategy: { person: "Tess Morgan", email: "strategy.admin@test.sam" },
  ops: { person: "Rhys Nolan", email: "ops.admin@test.sam" },
};

export function useSandbox() {
  const [admins, setAdmins] = useState(blankAdmins);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) setAdmins({ ...blankAdmins, ...JSON.parse(saved) });
    } catch {}
  }, []);

  const saveAdmin = (programId, admin) =>
    setAdmins((old) => {
      const next = { ...old, [programId]: admin };
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {}
      return next;
    });

  const resetAdmin = (programId) => saveAdmin(programId, blankAdmins[programId]);

  return [admins, saveAdmin, resetAdmin];
}