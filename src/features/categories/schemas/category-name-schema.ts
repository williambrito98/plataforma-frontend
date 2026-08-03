import { z } from "zod";

export const categoryNameSchema = z.object({
  name: z
    .string()
    .min(1, "O nome é obrigatório")
    .max(80, "Nome deve ter no máximo 80 caracteres"),
});

export type CategoryNameFormValues = z.infer<typeof categoryNameSchema>;
