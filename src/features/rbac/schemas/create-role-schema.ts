import { z } from "zod";

export const createRoleSchema = z.object({
  name: z.string().min(1, "Nome obrigatório"),
  description: z.string().optional(),
});

export type CreateRoleFormValues = z.infer<typeof createRoleSchema>;
