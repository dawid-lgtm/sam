import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { productCardsQuery, productsQuery } from "@/lib/catalog";
import { Section, EmptyLine } from "@/components/ui-kit/Section";
import { BackLink } from "@/components/ui-kit/BackLink";
import { Modal } from "@/components/ui-kit/Modal";
import { GhostButton, PrimaryButton } from "@/components/ui-kit/controls";
import { ProductCard } from "@/components/master/ProductCard";
import { CardChain } from "@/components/master/CardChain";
import { CardEditor } from "@/components/master/CardEditor";
import { CardRunner } from "@/components/master/CardRunner";
import { DEPLOYMENT_PLANS } from "@/lib/deploymentPlan";
import { DeploymentPlan } from "@/components/master/DeploymentPlan";
import { RhythmExplained } from "@/components/strategy/RhythmExplained";
import { GospaSheet } from "@/components/strategy/GospaSheet";
import { ProductDownloads } from "@/components/master/ProductDownloads";
import { syncWelcomeCard } from "@/lib/welcomeCard";

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
  const [running, setRunning] = useState(false);
  const [saving, setSaving] = useState(false);

  const plan = DEPLOYMENT_PLANS[productKey];
  const tabs = [
    ...(plan ? [{ id: "plan", label: "Deployment plan" }] : []),
    ...(plan ? [{ id: "rhythm", label: "IN, IN, IN, ON rhythm explained" }] : []),
    ...(plan ? [{ id: "gospa", label: "GOSPA explained" }] : []),
    { id: "chain", label: "Launch the program" },
    { id: "downloads", label: "Tools and downloads" },
  ];
  const [tab, setTab] = useState(null);
  const activeTab = tab || tabs[0].id;

  const product = products.find((p) => p.key === productKey);
  const refresh = async () => {
    if (product) await syncWelcomeCard(product);
    await queryClient.invalidateQueries({ queryKey: ["program-cards"] });
  };

  useEffect(() => {
    if (!product || !cards.length) return;
    let alive = true;
    syncWelcomeCard(product).then((changed) => {
      if (alive && changed) queryClient.invalidateQueries({ queryKey: ["program-cards"] });
    });
    return () => {
      alive = false;
    };
  }, [product?.key, cards]);

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
      <BackLink to="/master/products">All products</BackLink>

      <section className="rounded-2xl bg-card p-4">
        <h1 className="font-heading text-[26px] font-semibold leading-tight text-gold">{product.name}</h1>
        <div className="mt-3">
          <ProductCard product={product} />
        </div>
        <p className="mt-2 text-[15px] text-gold">{cards.length} cards · {cards.length} days</p>
      </section>

      <div className="sam-glass flex flex-wrap gap-2 rounded-xl p-1.5">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`min-h-[42px] shrink-0 rounded-lg px-3 text-[14px] font-semibold transition ${
              activeTab === t.id
                ? "bg-gold text-gold-foreground"
                : "bg-background/60 text-foreground hover:bg-background/80"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "plan" ? (
        <DeploymentPlan plan={plan} productKey={productKey} onOpenTools={() => setTab("downloads")} />
      ) : null}
      {activeTab === "rhythm" ? <RhythmExplained /> : null}
      {activeTab === "gospa" ? <GospaSheet /> : null}
      {activeTab === "downloads" ? <ProductDownloads productKey={productKey} /> : null}
      {activeTab === "chain" ? (
        <Section
          title="Card chain"
          subtitle="Drag the cards into the order they run, day by day."
          action={
            cards.length ? (
              <PrimaryButton onClick={() => setRunning(true)}>Run the chain</PrimaryButton>
            ) : null
          }
        >
          <CardChain
            cards={cards}
            onAdd={(format) => setEditing({ format })}
            onEdit={(card) => setEditing({ ...card })}
            onDelete={setDeleting}
            onReorder={reorder}
          />
        </Section>
      ) : null}

      <Modal open={running} onClose={() => setRunning(false)} title={product.name}>
        {running ? <CardRunner cards={cards} productKey={productKey} /> : null}
      </Modal>

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? `Edit card` : "Add a card"}
      >
        {editing ? (
          <CardEditor
            card={editing}
            productKey={productKey}
            saving={saving}
            onSave={saveCard}
            onCancel={() => setEditing(null)}
          />
        ) : null}
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