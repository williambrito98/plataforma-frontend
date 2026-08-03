import { z } from "zod";

export const assignUserRoleSchema = z.object({
  userId: z.string().min(1, "Selecione um usuário"),
  roleId: z.string(),
});

export type AssignUserRoleFormValues = z.infer<typeof assignUserRoleSchema>;

export const NO_ROLE_VALUE = "Selecione um papel";
