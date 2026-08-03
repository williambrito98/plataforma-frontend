import { z } from "zod";

export const createPermissionSchema = z.object({
  code: z.string().min(1, "Código obrigatório"),
  description: z.string().optional(),
});

export type CreatePermissionFormValues = z.infer<typeof createPermissionSchema>;
