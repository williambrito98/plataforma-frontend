import { z } from "zod";

export const NO_ROLE_VALUE = "Sem papel";

export const updateUserSchema = z.object({
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
    .refine(
      (value) => value === "" || value.length >= 8,
      "A senha deve ter no mínimo 8 caracteres",
    ),
  roleId: z.string(),
});

export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;
