import { z } from "zod";

export const createRoleSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(80, "Nome deve ter no máximo 80 caracteres"),
  description: z
    .string()
    .max(255, "Descrição deve ter no máximo 255 caracteres")
    .optional(),
});

export type CreateRoleFormValues = z.infer<typeof createRoleSchema>;
