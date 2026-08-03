import { getMe } from "@/features/auth/api/get-me";
import { validateToken } from "@/features/auth/api/validate-token";
import type { User } from "@/features/auth/types/auth";

export async function bootstrapAuth(): Promise<User | null> {
  try {
    const { valid } = await validateToken();

    if (!valid) {
      return null;
    }

    return await getMe();
  } catch {
    return null;
  }
}
