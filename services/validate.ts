import { Context, Next } from "koa";
import { ZodSchema, ZodError, ZodObject, ZodTypeAny } from "zod";

export const validate =
  (schema: ZodSchema) => async (ctx: Context, next: Next) => {
    try {
      ctx.request.body = schema.parse(ctx.request.body);
      await next();
    } catch (err) {
      if (err instanceof ZodError) {
        ctx.status = 400;
        ctx.body = {
          error: err.errors.map((e) => `${e.path.join(".")}: ${e.message}`),
        };
      } else {
        ctx.status = 500;
        ctx.body = { error: "Internal server error" };
      }
    }
  };

export const validatePartial =
  (schema: ZodObject<Record<string, ZodTypeAny>>) =>
  async (ctx: Context, next: Next) => {
    try {
      ctx.request.body = schema.partial().parse(ctx.request.body);
      await next();
    } catch (err) {
      if (err instanceof ZodError) {
        ctx.status = 400;
        ctx.body = {
          error: err.errors.map((e) => `${e.path.join(".")}: ${e.message}`),
        };
      } else {
        ctx.status = 500;
        ctx.body = { error: "Internal server error" };
      }
    }
  };
