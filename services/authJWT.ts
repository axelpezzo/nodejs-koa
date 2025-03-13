import { Context, Next } from "koa";
import jwt from "jsonwebtoken";
import prisma from "../prisma/client";

export const authToken = async (ctx: Context, next: Next) => {
  const token = ctx.headers.authorization?.split(" ")[1];
  if (!token) {
    ctx.status = 401;
    ctx.body = { error: "Token mancante" };
    return;
  }

  try {
    const payload = jwt.verify(token, process.env.SECRET_TOKEN as string) as {
      id: string;
      version: number;
    };

    const client = await prisma.apiClient.findUnique({
      where: { id: payload.id },
    });

    if (!client || client.version !== payload.version) {
      ctx.status = 401;
      ctx.body = { error: "Token non valido o scaduto" };
      return;
    }

    ctx.state.client = { id: client };
    await next();
  } catch (error) {
    ctx.status = 401;
    ctx.body = { error: "Token non valido" };
  }
};

export const invalidateJWTToken = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    return;
  }

  // User versionToken
  /*await prisma.user.update({
    where: { id },
    data: {
      versionToken: user.versionToken + 1,
    },
  });*/
};

export const generateJWT = async (id: string, name: string) => {
  const client = await prisma.apiClient.findUnique({ where: { id } });

  if (!client) {
    throw new Error("Client not found");
  }

  return jwt.sign(
    {
      id,
      name,
      timestamp: Date.now(),
      version: client.version,
    },
    process.env.SECRET_TOKEN as string,
    { expiresIn: "1h" }
  );
};
