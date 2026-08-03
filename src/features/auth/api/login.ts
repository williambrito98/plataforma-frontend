import { AuthError } from "@/features/auth/api/auth-error";
import { activateMockSession } from "@/features/auth/api/mock-session";
import type { LoginRequest, LoginResponse } from "@/features/auth/types/auth";

const MOCK_EMAIL = "admin@wimpra.com.br";
const MOCK_PASSWORD = "senha123";
const MOCK_DELAY_MS = 800;

function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
  await delay(MOCK_DELAY_MS);

  const email = data.email.trim().toLowerCase();

  if (email !== MOCK_EMAIL || data.password !== MOCK_PASSWORD) {
    throw new AuthError("E-mail ou senha inválidos", 401);
  }

  const response: LoginResponse = {
    user: {
      id: "1",
      name: "Administrador",
      email,
      role: {
        id: "admin-role",
        name: "Admin",
        description: "Administrador do sistema",
      },
      permissions: [
        "rbac.manage",
        "automacoes",
        "arquivos",
        "executions.read",
        "files.read",
        "automations.create",
      ],
    },
  };

  // Simula cookie httpOnly gravado pelo backend — sem localStorage/cookie manual.
  activateMockSession(response.user);

  return response;
}
