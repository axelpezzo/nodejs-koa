import { Context, Next } from "koa";
import prisma from "../prisma/client";

// Middleware per verificare se l'utente esiste
export const _userExists = async (ctx: Context, next: Next) => {
  try {
    const userId = ctx.request.body.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      ctx.status = 400;
      ctx.body = { error: "Utente non trovato", details: userId };
    } else {
      await next();
    }
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: "Errore del server" };
  }
};

//  Middleware con funzione per estrarre l'utente dal ctx
export const userExists = (getUserId: (ctx: Context) => string) => {
  return async (ctx: Context, next: Next) => {
    try {
      const userId = getUserId(ctx);
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        ctx.status = 400;
        ctx.body = { error: "Utente non trovato", details: userId };
      } else {
        await next();
      }
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: "Errore del server" };
    }
  };
};
