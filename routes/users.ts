import Router from "@koa/router";
import prisma from "../prisma/client";
import { User } from "@prisma/client";
import { userExists } from "../services/user";
import { authSession } from "../services/authSession";

const router = new Router({
  prefix: "/users",
});

router.get("/", async (ctx) => {
  const users = (await prisma.user.findMany()) as User[];
  ctx.body = users;
});

router.get("/:id", async (ctx) => {
  const user = await prisma.user.findUnique({
    where: { id: ctx.params.id },
  });

  if (!user) {
    ctx.status = 404;
    ctx.body = { error: "Utente non trovato" };
    return;
  }

  ctx.body = user;
});

router.patch("/:id", authSession, async (ctx) => {
  const body = ctx.request.body;
  const user = ctx.state.user;

  try {
    const user = await prisma.user.update({
      where: { id: ctx.params.id },
      data: body,
    });

    ctx.body = { message: "User aggiornato con successo", user };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: "Errore del server" };
  }
});

export default router;
