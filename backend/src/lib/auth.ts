import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { Context } from "hono";
import { Bindings, Variables } from "@/types";

export const createAuth = (
  c: Context<{ Variables: Variables; Bindings: Bindings }>
) => {
  const prisma = c.get("prisma");
  const kv = c.env.KV;

  return betterAuth({
    appName: "cloudflare-ai-chat",
    database: prismaAdapter(prisma, { provider: "sqlite" }),
    trustedOrigins: [
      "http://localhost:3000",
      "https://cloudflare-ai-chat.vercel.app",
    ],
    emailAndPassword: {
      enabled: true,
    },
    logger: { level: "debug", disabled: false },
    socialProviders: {
      google: {
        clientId: c.env.GOOGLE_CLIENT_ID,
        clientSecret: c.env.GOOGLE_CLIENT_SECRET,
      },
    },
    advanced: {
      generateId: false,
      // useSecureCookies: c.env.ENV === "PRODUCTION",
      defaultCookieAttributes: {
        sameSite: c.env.ENV === "PRODUCTION" ? "none" : "lax",
        secure: c.env.ENV === "PRODUCTION",
      },
    },
    rateLimit: { enabled: true },
    secret: c.env.BETTER_AUTH_SECRET,
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
