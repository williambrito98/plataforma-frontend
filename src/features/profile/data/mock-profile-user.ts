import type { ProfileUser } from "@/features/profile/types/profile";

export const mockProfileUser: ProfileUser = {
  id: "mock-user-1",
  name: "Marcelo Cardoso",
  email: "marcelo@wimpra.com.br",
  company: "WIMPRA",
  avatar: undefined,
  role: { id: "1", name: "Admin", description: null },
  permissions: ["automacoes", "arquivos", "ajustes"],
};
