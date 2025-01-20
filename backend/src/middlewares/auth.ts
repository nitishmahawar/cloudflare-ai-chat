import { setupAuth } from "@/lib/auth";
import { Bindings, Variables } from "@/types";
import { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";

export const auth = async (
  c: Context<{ Bindings: Bindings; Variables: Variables }>,
  next: Next
) => {
  const session = await setupAuth(c).api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    throw new HTTPException(401, { message: "Unauthorized!" });
  }

  c.set("user", session.user);
  c.set("session", session.session);
  return next();
};
