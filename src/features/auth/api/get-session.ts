import { getMockSessionUser } from "@/features/auth/api/mock-session";
import type { User } from "@/features/auth/types/auth";

export async function getSession(): Promise<User | null> {
  return getMockSessionUser();
}
