import { z } from "zod";

export const adjustSchema = z.object({
  name: z.string().trim().min(1, "Nome obrigatório"),
  description: z.string().trim().min(1, "Descrição obrigatória"),
  path: z.string().trim().min(1, "Caminho obrigatório"),
});

export type AdjustFormValues = z.infer<typeof adjustSchema>;
