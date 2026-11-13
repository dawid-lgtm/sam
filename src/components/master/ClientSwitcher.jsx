import { useQuery } from "@tanstack/react-query";
import { customersQuery } from "@/lib/masterQueries";
import { setActiveCustomerId, useActiveCustomer } from "@/lib/tenant";
import { useAuth } from "@/lib/AuthContext";

/**
 * Which client the administrator is working on. Everything saved from here is
 * stamped with the chosen client, so one client never sees another's records.
 */
export function ClientSwitcher() {
  const { user } = useAuth();
  const active = useActiveCustomer();
  const { data: customers = [] } = useQuery(customersQuery);

  if (user?.role !== "admin" || !customers.length) return null;
  const value = active || user?.customer_id || "";

  return (
    <label className="mr-1 hidden items-center gap-2 sm:flex">
      <span className="whitespace-nowrap text-[14px] text-muted-foreground">Working on</span>
      <select
        value={value}
        onChange={(e) => setActiveCustomerId(e.target.value)}
        aria-label="Client you are working on"
        className="min-h-[44px] max-w-[11rem] rounded-xl border border-input bg-background px-2.5 text-[15px] font-medium text-foreground focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/50"
      >
        <option value="">Choose a client</option>
        {customers.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </label>
  );
}