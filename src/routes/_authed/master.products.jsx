import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronRight, Plus } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { productsQuery, useAllCards } from "@/lib/catalog";
import { PageHeader } from "@/components/ui-kit/PageHeader";
import { Section, EmptyLine } from "@/components/ui-kit/Section";
import { Modal } from "@/components/ui-kit/Modal";
import { PrimaryButton } from "@/components/ui-kit/controls";
import { ProductForm } from "@/components/master/ProductForm";

export const Route = createFileRoute("/_authed/master/products")({
  component: ProductsPage,
  head: () => ({ meta: [{ title: "Sam — Products" }] }),
});

function ProductsPage() {
  const queryClient = useQueryClient();
  const { data: products = [], isLoading } = useQuery(productsQuery);
  const cards = useAllCards();
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  const create = async (payload) => {
    setSaving(true);
    try {
      await base44.entities.Product.create(payload);
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      setCreating(false);
    } finally {
      setSaving(false);
    }
  };

  const countCards = (key) => cards.filter((card) => card.product_key === key).length;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Products"
        intro="Build each product as a daily chain of cards, then assign the products a customer runs from their customer page."
      />

      <Section
        title={`The suite (${products.length})`}
        subtitle="Open a product to build its card chain and drag the cards into order."
        action={
          <PrimaryButton onClick={() => setCreating(true)}>
            <Plus className="h-5 w-5" /> New product
          </PrimaryButton>
        }
      >
        {isLoading ? (
          <div className="h-32 animate-pulse rounded-xl bg-background/40" />
        ) : products.length ? (
          <div className="grid gap-2 sm:grid-cols-2">
            {products.map((product) => (
              <Link
                key={product.id}
                to="/master/products/$productKey"
                params={{ productKey: product.key }}
                className="rounded-xl bg-background/40 p-3 transition hover:ring-2 hover:ring-gold"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[15px] font-semibold leading-snug">{product.name}</p>
                  <ChevronRight className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                </div>
                {product.description ? (
                  <p className="mt-1 text-[14px] leading-snug text-muted-foreground">{product.description}</p>
                ) : null}
                <p className="mt-2 text-[14px] text-gold">
                  {countCards(product.key)} cards{product.status === "Later" ? " · later" : ""}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyLine>No products yet. Create the first one.</EmptyLine>
        )}
      </Section>

      <Modal open={creating} onClose={() => setCreating(false)} title="New product">
        <ProductForm nextSort={products.length} saving={saving} onSave={create} onCancel={() => setCreating(false)} />
      </Modal>
    </div>
  );
}