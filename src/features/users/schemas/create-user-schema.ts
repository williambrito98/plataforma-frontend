import { z } from "zod";

export const createUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "O nome é obrigatório")
    .max(255, "O nome deve ter no máximo 255 caracteres"),
  email: z
    .string()
    .trim()
    .min(1, "O email é obrigatório")
    .email("Email inválido")
    .max(255, "O email deve ter no máximo 255 caracteres"),
  password: z
    .string()
    .min(8, "A senha deve ter no mínimo 8 caracteres")
    .max(255, "A senha deve ter no máximo 255 caracteres"),
  roleId: z.string().min(1, "Selecione um papel"),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;
