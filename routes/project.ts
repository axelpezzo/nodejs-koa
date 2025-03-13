import Router from "@koa/router";
import prisma from "../prisma/client";
import { projectSchema } from "../prisma/schema/projectSchema";
import { z } from "zod";
import { userExists } from "../services/user";
import { validate, validatePartial } from "../services/validate";
import { Project } from "@prisma/client";
import { authToken } from "../services/authJWT";

const router = new Router({
  prefix: "/project",
});

// Crea un nuovo Project
router.post(
  "/",
  validate(projectSchema),
  userExists((ctx) => ctx.request.body.userId),
  async (ctx) => {
    try {
      const body = ctx.request.body as Project;

      const project = await prisma.project.create({
        data: {
          title: body.title,
          userId: body.userId,
        },
      });

      ctx.status = 201;
      ctx.body = { message: "Progetto creato con successo", project };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: "Errore del server" };
    }
  }
);

// Ottieni tutti i Projects
router.get("/", authToken, async (ctx) => {
  const projects = await prisma.project.findMany();
  ctx.body = projects;
});

// Ottieni un singolo Project per ID
router.get("/:id", async (ctx) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: ctx.params.id },
    });

    if (!project) {
      ctx.status = 404;
      ctx.body = { error: "Progetto non trovato" };
      return;
    }

    ctx.body = project;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: "Errore del server" };
  }
});

// Aggiorna un Project
router.patch("/:id", validatePartial(projectSchema), async (ctx) => {
  try {
    const body = ctx.request.body;

    const project = await prisma.project.update({
      where: { id: ctx.params.id },
      data: body,
    });

    ctx.body = { message: "Progetto aggiornato con successo", project };
  } catch (error) {
    if (error instanceof z.ZodError) {
      ctx.status = 400;
      ctx.body = { error: "Errore di validazione", details: error.errors };
    } else {
      ctx.status = 500;
      ctx.body = { error: "Errore del server" };
    }
  }
});

// Cancella un Project
router.delete("/:id", async (ctx) => {
  try {
    await prisma.project.delete({
      where: { id: ctx.params.id },
    });
    ctx.body = { message: "Progetto eliminato con successo" };
  } catch (error) {
    ctx.status = 404;
    ctx.body = { error: "Progetto non trovato" };
  }
});

export default router;
