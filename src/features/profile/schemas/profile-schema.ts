import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().trim().min(1, "Nome obrigatório"),
  email: z.string(),
  company: z.string(),
  password: z
    .string()
    .refine(
      (value) => value === "" || value.length >= 8,
      "A senha deve ter no mínimo 8 caracteres",
    ),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
