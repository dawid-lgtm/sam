import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireUser } from "@/lib/auth-middleware";

const SummaryInput = z.object({
  customers: z.number().int().min(0).max(1000000),
  activeCustomers: z.number().int().min(0).max(1000000),
  users: z.number().int().min(0).max(1000000),
  tools: z.number().int().min(0).max(1000000),
  products: z
    .array(
      z.object({
        name: z.string().max(80),
        customers: z.number().int().min(0).max(1000000),
        progress: z.number().min(0).max(100),
      }),
    )
    .max(20),
  statuses: z
    .array(z.object({ name: z.string().max(40), count: z.number().int().min(0).max(1000000) }))
    .max(10),
});

export const getAdminSummary = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(SummaryInput)
  .handler(async ({ data, context }) => {
    if (context.user.role !== "admin") {
      throw Object.assign(new Error("Forbidden"), { status: 403 });
    }

    const products = data.products
      .map((p) => `- ${p.name}: ${p.customers} customers, average progress ${Math.round(p.progress)}%`)
      .join("\n");
    const statuses = data.statuses.map((s) => `- ${s.name}: ${s.count}`).join("\n");

    return context.getBase44().integrations.Core.InvokeLLM({
      prompt: `You are the analyst for Sam, a mining leadership SaaS ("Mine in a box\u2122"). Write a short read-out for the super admin on the whole customer base.

Numbers:
- Customers: ${data.customers} (${data.activeCustomers} active)
- People with a login: ${data.users}
- Tools in the central repository: ${data.tools}

Product adoption:
${products || "- none yet"}

Customer status:
${statuses || "- none yet"}

Write exactly three bullet points, each one sentence, in plain Australian mining language. Cover (1) where the customer base stands, (2) which program needs attention, (3) the next commercial or training move. Do not invent numbers that are not above. No preamble, no heading, no markdown bold.`,
    });
  });