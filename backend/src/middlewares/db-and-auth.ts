import { createPrisma } from "@/lib/prisma";
import { Bindings, Variables } from "@/types";
import { Context, Next } from "hono";

export const initDBAndAuth = (
  c: Context<{ Variables: Variables; Bindings: Bindings }>,
  next: Next
) => {
  const prisma = createPrisma(c.env.DB);

  c.set("prisma", prisma);

  return next();
};
