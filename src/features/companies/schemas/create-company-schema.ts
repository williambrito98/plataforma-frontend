import { z } from "zod";

export const createCompanySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "O nome é obrigatório")
    .max(255, "O nome deve ter no máximo 255 caracteres"),
  document: z
    .string()
    .trim()
    .max(18, "O documento deve ter no máximo 18 caracteres")
    .optional()
    .or(z.literal("")),
});

export type CreateCompanyFormValues = z.infer<typeof createCompanySchema>;
