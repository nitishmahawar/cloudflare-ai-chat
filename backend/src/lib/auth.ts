import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { Context } from "hono";
import { Bindings, Variables } from "@/types";

export const setupAuth = (
  c: Context<{ Variables: Variables; Bindings: Bindings }>
) => {
  const prisma = c.get("prisma");
  const kv = c.env.KV;

  return betterAuth({
    appName: "cloudflare-ai-chat",
    database: prismaAdapter(prisma, { provider: "sqlite" }),
    secret: c.env.BETTER_AUTH_SECRET,
    baseURL: c.env.BETTER_AUTH_URL,
    trustedOrigins: c.env.TRUSTED_ORIGIN.split(","),
    socialProviders: {
      google: {
        clientId: c.env.GOOGLE_CLIENT_ID,
        clientSecret: c.env.GOOGLE_CLIENT_SECRET,
      },
    },
    advanced: {
      generateId: false,
      crossSubDomainCookies: {
        enabled: !c.env.BETTER_AUTH_URL.includes("localhost"),
        domain: "nitishmahawar.dev",
      },
    },
    rateLimit: { enabled: true },
    secondaryStorage: {
      get: async (key) => {
        const value = await kv.get(key, "text");
        return value ? value : null;
      },
      set: async (key, value, ttl) => {
        if (ttl) {
          await kv.put(key, value, { expirationTtl: ttl });
        } else {
          await kv.put(key, value);
        }
      },
      delete: async (key) => {
        await kv.delete(key);
      },
    },
  });
};
