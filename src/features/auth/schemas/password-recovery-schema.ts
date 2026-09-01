import { z } from "zod";

export const passwordRecoveryEmailSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Informe um e-mail válido")
    .email("Informe um e-mail válido"),
});

export const passwordRecoveryCodeSchema = z.object({
  code: z
    .string()
    .length(6, "O código deve conter 6 dígitos")
    .regex(/^\d{6}$/, "O código deve conter 6 dígitos"),
});

export const passwordRecoveryPasswordSchema = z
  .object({
    password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
    confirmPassword: z
      .string()
      .min(8, "A senha deve ter no mínimo 8 caracteres"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type PasswordRecoveryEmailValues = z.infer<
  typeof passwordRecoveryEmailSchema
>;
export type PasswordRecoveryCodeValues = z.infer<
  typeof passwordRecoveryCodeSchema
>;
export type PasswordRecoveryPasswordValues = z.infer<
  typeof passwordRecoveryPasswordSchema
>;

export type PasswordRecoveryStep = "email" | "code" | "password";
