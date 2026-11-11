import { base44 } from "@/api/base44Client";

export const WELCOME_TITLE = "Welcome";

export function buildWelcomeBody(product, cards) {
  const chain = cards.filter((card) => !card.is_welcome);
  const total = chain.length + 1;
  const overview = chain
    .map((card, i) => `${i + 2}. ${card.title || "Untitled card"}`)
    .join("\n");

  return [
    `Welcome to ${product?.name || "this program"}.`,
    `This chain is ${total} cards long and you run one card a day. Finish the card in front of you and the next one opens. The bar at the top is your progress, saved as you go, so you can stop and come back.`,
    overview ? `What the chain covers\n${overview}` : "There are no cards after this one yet.",
    "By the last card you will have run the program, not read it.",
  ].join("\n\n");
}

export async function syncWelcomeCard(product) {
  if (!product?.key) return false;
  const page = await base44.entities.ProgramCard.filter(
    { product_key: product.key },
    { sort: "sort", limit: 500 }
  );
  const cards = page.items || [];
  const welcome = cards.find((card) => card.is_welcome);
  const body = buildWelcomeBody(product, cards);

  if (!welcome) {
    await base44.entities.ProgramCard.create({
      product_key: product.key,
      format: "text",
      title: WELCOME_TITLE,
      body,
      is_welcome: true,
      sort: -1,
    });
    return true;
  }

  if (welcome.body !== body || welcome.title !== WELCOME_TITLE) {
    await base44.entities.ProgramCard.update(welcome.id, { title: WELCOME_TITLE, body, is_welcome: true });
    return true;
  }

  return false;
}