import { Hook } from "@hono/zod-validator";
import { Env } from "hono";
import { ZodError } from "zod";

export const defaultHook: Hook<unknown, Env, ""> = (result, ctx) => {
  if (!result.success && result.error instanceof ZodError) {
    return ctx.json(
      { success: false, error: result.error.issues[0].message },
      400
    );
  }
};
