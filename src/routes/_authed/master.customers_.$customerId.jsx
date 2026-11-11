import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useProducts } from "@/lib/catalog";
import { appUsersQuery, averageProgress, customersQuery, toolsQuery } from "@/lib/masterQueries";
import { Section, EmptyLine } from "@/components/ui-kit/Section";
import { Modal } from "@/components/ui-kit/Modal";
import { GhostButton } from "@/components/ui-kit/controls";
import { CustomerForm } from "@/components/master/CustomerForm";
import { ProductPicker } from "@/components/master/ProductPicker";
import { ProductChips, ProgressBar, StatusChip } from "@/components/master/bits";

export const Route = createFileRoute("/_authed/master/customers_/$customerId")({
  component: CustomerDetail,
});

function CustomerDetail() {
  const { customerId } = Route.useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: customers = [], isLoading } = useQuery(customersQuery);
  const { data: users = [] } = useQuery(appUsersQuery);
  const { data: tools = [] } = useQuery(toolsQuery);
  const catalog = useProducts();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const customer = customers.find((c) => c.id === customerId);

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["customers"] });

  if (isLoading && !customer) return <div className="h-40 animate-pulse rounded-2xl bg-background/40" />;

  if (!customer) {
    return (
      <Section>
        <EmptyLine>
          That customer is no longer here.{" "}
          <Link to="/master/customers" className="text-gold underline">
            Back to customers
          </Link>
        </EmptyLine>
      </Section>
    );
  }

  const products = customer.products || [];
  const people = users.filter((u) => u.customer_id === customer.id);
  const assignedTools = tools.filter((t) => (t.assigned_products || []).some((k) => products.includes(k)));
  const avg = averageProgress(customer, products, catalog);

  const save = async (patch) => {
    setSaving(true);
    try {
      await base44.entities.Customer.update(customer.id, patch);
      setEditing(false);
      await refresh();
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    await base44.entities.Customer.delete(customer.id);
    setConfirmDelete(false);
    await refresh();
    navigate({ to: "/master/customers" });
  };

  return (
    <div className="space-y-4">
      <Link to="/master/customers" className="inline-flex min-h-[44px] items-center gap-2 text-[15px] font-medium">
        <ArrowLeft className="h-5 w-5" /> All customers
      </Link>

      <section className="rounded-2xl bg-card p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h1 className="font-heading text-[26px] font-semibold leading-tight">{customer.name}</h1>
            <p className="mt-1 text-[14px] text-muted-foreground">
              {[customer.code, customer.region, customer.start_date].filter(Boolean).join(" · ") || "No code or region yet"}
            </p>
          </div>
          <StatusChip status={customer.status} />
        </div>
        <p className="mt-2 text-[15px]">
          {[customer.contact_name, customer.contact_email].filter(Boolean).join(" · ") || "No main contact yet"}
        </p>
        {customer.sites?.length ? <p className="mt-1 text-[14px] text-muted-foreground">Sites: {customer.sites.join(", ")}</p> : null}
        {customer.notes ? <p className="mt-2 rounded-xl bg-background/40 p-3 text-[15px]">{customer.notes}</p> : null}
        <div className="mt-3 flex flex-wrap gap-2">
          <GhostButton onClick={() => setEditing(true)}>
            <Pencil className="h-5 w-5" /> Edit customer
          </GhostButton>
          <GhostButton onClick={() => setConfirmDelete(true)}>
            <Trash2 className="h-5 w-5" /> Delete
          </GhostButton>
        </div>
      </section>

      <Section title="Products they have" subtitle="Tap to turn a product or program on or off for this customer.">
        <ProductPicker value={products} onChange={(next) => save({ products: next })} />
        <p className="mt-2 text-[14px] text-muted-foreground">{saving ? "Saving…" : `Average progress ${avg ?? 0}%`}</p>
      </Section>

      <Section title="Product progress" subtitle="Updated by the super admin from the products they run.">
        {products.length ? (
          <div className="space-y-3">
            {products.map((key) => {
              const product = catalog.find((p) => p.key === key);
              if (!product?.progress_field) return null;
              return <ProgressBar key={key} value={customer[product.progress_field] || 0} label={product.name} />;
            })}
          </div>
        ) : (
          <EmptyLine>No programs assigned yet.</EmptyLine>
        )}
      </Section>

      <Section
        title={`People (${people.length})`}
        action={
          <Link to="/master/users" className="text-[15px] font-semibold text-gold">
            Manage
          </Link>
        }
      >
        {people.length ? (
          <ul className="space-y-1.5">
            {people.map((p) => (
              <li key={p.id} className="flex flex-wrap items-baseline justify-between gap-2 rounded-xl bg-background/40 p-3 text-[15px]">
                <span className="font-semibold">{p.full_name || p.email}</span>
                <span className="text-[14px] text-muted-foreground">
                  {p.email} · {p.role === "admin" ? "Super admin" : "User"}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyLine>No one from this customer has a login yet.</EmptyLine>
        )}
      </Section>

      <Section title={`Tools available to them (${assignedTools.length})`} subtitle="From the central repository, by product.">
        {assignedTools.length ? (
          <ul className="space-y-1.5">
            {assignedTools.map((t) => (
              <li key={t.id} className="rounded-xl bg-background/40 p-3">
                <p className="text-[15px] font-semibold">{t.title}</p>
                <p className="text-[14px] text-muted-foreground">{t.category} · {t.version || "v1"}</p>
                <div className="mt-1"><ProductChips keys={t.assigned_products || []} /></div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyLine>No tools assigned to this customer's products yet.</EmptyLine>
        )}
      </Section>

      <Modal open={editing} onClose={() => setEditing(false)} title={`Edit ${customer.name}`}>
        <CustomerForm customer={customer} saving={saving} onSave={save} onCancel={() => setEditing(false)} />
      </Modal>

      <Modal open={confirmDelete} onClose={() => setConfirmDelete(false)} title="Delete this customer?">
        <p className="text-[15px]">
          {customer.name} will be removed from the system. People keep their logins but will have no customer.
        </p>
        <div className="mt-4 flex gap-2">
          <GhostButton className="flex-1" onClick={remove}>
            Delete customer
          </GhostButton>
          <GhostButton className="flex-1" onClick={() => setConfirmDelete(false)}>
            Keep
          </GhostButton>
        </div>
      </Modal>
    </div>
  );
}