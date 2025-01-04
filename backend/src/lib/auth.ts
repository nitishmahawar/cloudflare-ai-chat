import { PrismaClient } from "@prisma/client";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { openAPI } from "better-auth/plugins";
import { hashPassword } from "./utils";

export const createAuth = ({
  prisma,
  authSecret,
  kv,
  google,
  trustedOrigin,
}: {
  prisma: PrismaClient;
  authSecret: string;
  kv: KVNamespace<string>;
  google: { clientId: string; clientSecret: string };
  trustedOrigin: string;
}) => {
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
    socialProviders: {
      google: {
        clientId: google.clientId,
        clientSecret: google.clientSecret,
      },
    },
    advanced: {
      generateId: false,
    },
    secret: authSecret,
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
