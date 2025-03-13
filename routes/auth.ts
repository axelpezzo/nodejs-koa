import Router from "@koa/router";
import prisma from "../prisma/client";
import { Prisma, User } from "@prisma/client";
import {
  authSession,
  createSession,
  invalidateSessionToken,
} from "../services/authSession";
import { userExists } from "../services/user";
import { generateJWT } from "../services/authJWT";

const router = new Router({
  prefix: "/auth",
});

router.post("/register", async (ctx) => {
  const { name, email, password } = ctx.request.body as User;

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });

    ctx.status = 201;
    ctx.body = { message: "Utente id:" + user.id + " registrato con successo" };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      ctx.status = 409; // HTTP 409 Conflict
      ctx.body = { error: "L'email è già in uso" };
    } else {
      ctx.status = 500;
      ctx.body = { error: "Errore durante la registrazione" };
    }
  }
});

router.post("/login", async (ctx) => {
  const { email, password } = ctx.request.body as User;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    ctx.status = 404;
    ctx.body = { error: "Utente non trovato" };
    return;
  }

  if (user.password !== password) {
    ctx.status = 401;
    ctx.body = { error: "Password errata" };
    return;
  }

  const tokenSession = await createSession(user.id);

  ctx.cookies.set("SESSION_TOKEN", tokenSession, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  ctx.body = { message: "Utente loggato con successo" };
});

router.post("/logout", authSession, async (ctx) => {
  try {
    await invalidateSessionToken(ctx.state.session.id);
    ctx.cookies.set("SESSION_TOKEN");
    ctx.body = { message: "Utente sloggato con successo" };
  } catch (error) {
    ctx.status = 404;
    ctx.body = { error: "Utente non trovato" };
  }
});

router.post("/token", authSession, async (ctx) => {
  try {
    const client = await prisma.apiClient.create({
      data: {
        name: ctx.request.body.name,
      },
    });

    const token = await generateJWT(client.id, client.name);

    ctx.body = { token };
    ctx.status = 201;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: "Errore del server" };
  }
});

export default router;
