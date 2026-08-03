import { z } from "zod";

export const assignUserRoleSchema = z.object({
  userId: z.string().min(1, "User ID obrigatório"),
  roleId: z.string(),
});

export type AssignUserRoleFormValues = z.infer<typeof assignUserRoleSchema>;

export const NO_ROLE_VALUE = "__none__";
