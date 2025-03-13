import { z } from "zod";

export const projectSchema = z
  .object({
    title: z.string().min(3, "Il nome deve avere almeno 3 caratteri"),
    userId: z.string().cuid("accountId deve essere un CUID valido"),
  })
  .strict();
