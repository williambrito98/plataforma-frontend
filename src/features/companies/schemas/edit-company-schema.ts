import { z } from "zod";

import { createCompanySchema } from "@/features/companies/schemas/create-company-schema";

export const editCompanySchema = createCompanySchema.pick({
  name: true,
  document: true,
});

export type EditCompanyFormValues = z.infer<typeof editCompanySchema>;
