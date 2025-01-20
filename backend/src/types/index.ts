import { PrismaClient } from "@prisma/client";
import { Session, User } from "better-auth";

export interface Bindings {
  DB: D1Database;
  KV: KVNamespace;
  AI: Ai;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  GROQ_API_KEY: string;
  TRUSTED_ORIGIN: string;
}

export interface Variables {
  prisma: PrismaClient;
  user: User;
  session: Session;
}

export interface SuccessResponse {
  success: true;
  data: any;
  message: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
  stack?: string;
}
