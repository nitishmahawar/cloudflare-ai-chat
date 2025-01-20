import { Hono } from "hono";
import { Bindings, ErrorResponse, Variables } from "@/types";
import { initDBAndAuth } from "@/middlewares/db-and-auth";
import chatApp from "@/chat";
import { HTTPException } from "hono/http-exception";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { setupAuth } from "@/lib/auth";

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>()
  .use(
    "*",
    cors({
      origin: [
        "http://localhost:3000",
        "https://cloudflare-ai-chat.vercel.app",
        "https://cfw-chat.nitishmahawar.dev",
      ],
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["POST", "GET", "PATCH", "DELETE", "OPTIONS"],
      exposeHeaders: ["Content-Length", "Set-Cookie"],
      maxAge: 600,
      credentials: true,
    }),
    logger(),
    initDBAndAuth
  )
  .on(["POST", "GET"], "/api/auth/**", (c) => {
    return setupAuth(c).handler(c.req.raw);
  })
  .get("/", (c) => {
    return c.json({ success: true, message: "✨Cloudflare AI Chat API!✨" });
  })
  .route("/api/chat", chatApp)
  .notFound((c) => {
    return c.json<ErrorResponse>(
      {
        success: false,
        error: "Requested endpoint not exists!",
      },
      404
    );
  })
  .onError((error, c) => {
    if (error instanceof HTTPException) {
      return c.json<ErrorResponse>(
        { success: false, error: error.message },
        error.status
      );
    }

    return c.json<ErrorResponse>({
      success: false,
      error: "Internal Server Error!",
    });
  });

export default app;
