import { z } from "zod";

export const createAutomationSchema = z.object({
  name: z.string().trim().min(1, "Nome obrigatório"),
  description: z.string().trim().min(1, "Descrição obrigatória"),
  path: z.string().trim().min(1, "Caminho obrigatório"),
  categoryId: z.string().min(1, "Categoria obrigatória"),
});

export type CreateAutomationFormValues = z.infer<typeof createAutomationSchema>;
