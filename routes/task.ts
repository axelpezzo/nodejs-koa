import Router from "@koa/router";
import prisma from "../prisma/client";

const router = new Router({
  prefix: "/task",
});

// Crea un nuovo Task
router.post("/", async (ctx) => {
  try {
    const body = ctx.request.body;
    const task = await prisma.task.create({
      data: {
        title: body.title,
        status: body.status,
        projectId: body.projectId,
      },
    });

    ctx.status = 201;
    ctx.body = { message: "Task creato con successo", task };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: "Errore del server" };
  }
});

// Ottieni tutti i Tasks
router.get("/", async (ctx) => {
  const tasks = await prisma.task.findMany();
  ctx.body = tasks;
});

// Ottieni un singolo Task per ID
router.get("/:id", async (ctx) => {
  const task = await prisma.task.findUnique({
    where: { id: ctx.params.id },
  });

  if (!task) {
    ctx.status = 404;
    ctx.body = { error: "Task non trovato" };
    return;
  }

  ctx.body = task;
});

// Aggiorna un Task
router.put("/:id", async (ctx) => {
  try {
    const body = ctx.request.body;

    const task = await prisma.task.update({
      where: { id: ctx.params.id },
      data: body,
    });

    ctx.body = { message: "Task aggiornato con successo", task };
  } catch (error) {
    ctx.status = 400;
    ctx.body = { error: "Errore di validazione o task non trovato" };
  }
});

// Cancella un Task
router.delete("/:id", async (ctx) => {
  try {
    await prisma.task.delete({
      where: { id: ctx.params.id },
    });
    ctx.body = { message: "Task eliminato con successo" };
  } catch (error) {
    ctx.status = 404;
    ctx.body = { error: "Task non trovato" };
  }
});

export default router;
