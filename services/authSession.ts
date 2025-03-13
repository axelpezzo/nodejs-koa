import { Context, Next } from "koa";
import prisma from "../prisma/client";
import { randomBytes } from "node:crypto";

export const authSession = async (ctx: Context, next: Next) => {
  const sessionId = ctx.cookies.get("SESSION_TOKEN");

  if (!sessionId) {
    ctx.status = 401;
    ctx.body = { error: "Sessione mancante" };
    return;
  }

  try {
    const session = await prisma.session.findUnique({
      where: { sessionId },
    });

    if (!session || new Date() > session.expiresAt) {
      ctx.status = 401;
      ctx.body = { error: "Sessione scaduta o non valida" };
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!user) {
      ctx.status = 403;
      ctx.body = { error: "Sessione non valida" };
      return;
    }

    ctx.state.user = { id: user.id };
    ctx.state.session = { id: session.sessionId };
  } catch (error) {
    ctx.status = 403;
    ctx.body = { error: "Token non valido" };
    return;
  }

  await next();
};

export const invalidateSessionToken = async (sessionId: string) => {
  await prisma.session.delete({
    where: { sessionId },
  });
};

// User sessionToken
export const userToken = async (userId: string) => {
  const sessionToken = randomBytes(32).toString("hex");

  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        //sessionToken,
      },
    });

    return sessionToken;
  } catch (error) {
    return;
  }
};

export const createSession = async (userId: string) => {
  const session = await prisma.session.create({
    data: {
      userId,
      sessionId: randomBytes(32).toString("hex"),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    },
  });

  return session.sessionId;
};
