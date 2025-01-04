import { createAuth } from "@/lib/auth";
import { createPrisma } from "@/lib/prisma";
import { Bindings, Variables } from "@/types";
import { Context, Next } from "hono";

export const initDBAndAuth = (
  c: Context<{ Variables: Variables; Bindings: Bindings }>,
  next: Next
) => {
  const prisma = createPrisma(c.env.DB);

  c.set("prisma", prisma);

  const auth = createAuth({
    prisma,
    kv: c.env.KV,
    authSecret: c.env.BETTER_AUTH_SECRET,
    google: {
      clientId: c.env.GOOGLE_CLIENT_ID,
      clientSecret: c.env.GOOGLE_CLIENT_SECRET,
    },
    trustedOrigin: c.env.TRUSTED_ORIGIN,
  });

  c.set("auth", auth);

  return next();
};
