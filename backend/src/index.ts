import { Hono } from "hono";
import { Bindings, ErrorResponse, Variables } from "@/types";
import { initDBAndAuth } from "@/middlewares/db-and-auth";
import chatApp from "@/chat";
import { HTTPException } from "hono/http-exception";
import { cors } from "hono/cors";
import { User } from "@prisma/client";

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>()
  .use(
    "*",
    cors({
      origin: [
        "http://localhost:3000",
        "https://cloudflare-ai-chat.vercel.app",
      ], // replace with your origin
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["POST", "GET", "PATCH", "DELETE", "OPTIONS"],
      exposeHeaders: ["Content-Length"],
      maxAge: 600,
      credentials: true,
    }),
    initDBAndAuth
  )
  .on(["POST", "GET"], "/api/auth/**", (c) => {
    const auth = c.get("auth");
    return auth.handler(c.req.raw);
  })
  .get("/", (c) => {
    return c.text("Hello Hono!");
  })
  .route("/api/chat", chatApp)
  .get("/api/users", async (c) => {
    const prisma = c.get("prisma");
    const kv = c.env.KV;

    let users: User[] | null = await kv.get("users", "json");

    if (users) {
      return c.json({ success: true, data: users, message: "From cache" });
    }

    users = await prisma.user.findMany();
    await kv.put("users", JSON.stringify(users));

    return c.json({ success: true, data: users, message: "From db" });
  })
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
