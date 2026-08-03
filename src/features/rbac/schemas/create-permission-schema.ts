import { z } from "zod";

export const createPermissionSchema = z.object({
  code: z
    .string()
    .min(2, "Código deve ter pelo menos 2 caracteres")
    .max(120, "Código deve ter no máximo 120 caracteres"),
  description: z
    .string()
    .max(255, "Descrição deve ter no máximo 255 caracteres")
    .optional(),
});

export type CreatePermissionFormValues = z.infer<typeof createPermissionSchema>;
