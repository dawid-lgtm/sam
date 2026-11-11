import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { productCardsQuery, productsQuery } from "@/lib/catalog";
import { Section, EmptyLine } from "@/components/ui-kit/Section";
import { Modal } from "@/components/ui-kit/Modal";
import { GhostButton } from "@/components/ui-kit/controls";
import { ProductCard } from "@/components/master/ProductCard";
import { CardChain } from "@/components/master/CardChain";
import { CardEditor } from "@/components/master/CardEditor";

export const Route = createFileRoute("/_authed/master/products_/$productKey")({
  component: ProductChain,
});

function ProductChain() {
  const { productKey } = Route.useParams();
  const queryClient = useQueryClient();
  const { data: products = [], isLoading } = useQuery(productsQuery);
  const { data: cards = [] } = useQuery(productCardsQuery(productKey));
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [saving, setSaving] = useState(false);

  const product = products.find((p) => p.key === productKey);
  const refresh = () => queryClient.invalidateQueries({ queryKey: ["program-cards"] });

  const saveCard = async (payload) => {
    setSaving(true);
    try {
      if (editing.id) {
        await base44.entities.ProgramCard.update(editing.id, payload);
      } else {
        await base44.entities.ProgramCard.create({ ...payload, product_key: productKey, format: editing.format, sort: cards.length });
      }
      setEditing(null);
      await refresh();
    } finally {
      setSaving(false);
    }
  };

  const reorder = async (ids) => {
    await base44.entities.ProgramCard.bulkUpdate(ids.map((id, index) => ({ id, sort: index })));
    await refresh();
  };

  const remove = async () => {
    await base44.entities.ProgramCard.delete(deleting.id);
    setDeleting(null);
    await refresh();
  };

  if (isLoading && !product) return <div className="h-40 animate-pulse rounded-2xl bg-background/40" />;

  if (!product) {
    return (
      <Section>
        <EmptyLine>
          That product is no longer here.{" "}
          <Link to="/master/products" className="text-gold underline">
            Back to products
          </Link>
        </EmptyLine>
      </Section>
    );
  }

  return (
    <div className="space-y-4">
      <Link to="/master/products" className="inline-flex min-h-[44px] items-center gap-2 text-[15px] font-medium">
        <ArrowLeft className="h-5 w-5" /> All products
      </Link>

      <section className="rounded-2xl bg-card p-4">
        <h1 className="font-heading text-[26px] font-semibold leading-tight">{product.name}</h1>
        <div className="mt-3">
          <ProductCard product={product} />
        </div>
        <p className="mt-2 text-[15px] text-gold">{cards.length} cards · {cards.length} days</p>
      </section>

      <Section title="Card chain" subtitle="Drag the cards into the order they run, day by day.">
        <CardChain
          cards={cards}
          onAdd={(format) => setEditing({ format })}
          onEdit={(card) => setEditing({ ...card })}
          onDelete={setDeleting}
          onReorder={reorder}
        />
      </Section>

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? `Edit card` : "Add a card"}
      >
        {editing ? <CardEditor card={editing} saving={saving} onSave={saveCard} onCancel={() => setEditing(null)} /> : null}
      </Modal>

      <Modal open={!!deleting} onClose={() => setDeleting(null)} title="Remove this card?">
        <p className="text-[15px]">The card leaves the chain and the days after it move up one.</p>
        <div className="mt-4 flex gap-2">
          <GhostButton className="flex-1" onClick={remove}>
            Remove card
          </GhostButton>
          <GhostButton className="flex-1" onClick={() => setDeleting(null)}>
            Keep
          </GhostButton>
        </div>
      </Modal>
    </div>
  );
}