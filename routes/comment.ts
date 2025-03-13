import Router from "@koa/router";
import prisma from "../prisma/client";

const router = new Router();

router.post("/tasks/:taskId/comments", async (ctx) => {
  const { content, userId } = ctx.request.body as {
    content: string;
    userId: string;
  };

  const { taskId } = ctx.params;

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        taskId,
        userId,
      },
    });

    ctx.body = comment;
  } catch (error) {
    ctx.status = 400;
    ctx.body = { error: "Errore nella creazione del commento" };
  }
});

router.get("/tasks/:taskId/comments", async (ctx) => {
  const { taskId } = ctx.params;

  try {
    const comments = await prisma.comment.findMany({
      where: { taskId },
      include: { user: true }, // Include chi ha scritto il commento
    });

    ctx.body = comments;
  } catch (error) {
    ctx.status = 400;
    ctx.body = { error: "Errore nel recupero dei commenti" };
  }
});

router.delete("/comments/:commentId", async (ctx) => {
  const { commentId } = ctx.params;

  try {
    await prisma.comment.delete({
      where: { id: commentId },
    });

    ctx.body = { message: "Commento eliminato" };
  } catch (error) {
    ctx.status = 400;
    ctx.body = { error: "Errore durante l'eliminazione del commento" };
  }
});

export default router;
