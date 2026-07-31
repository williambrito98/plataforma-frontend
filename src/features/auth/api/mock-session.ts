import type { User } from "@/features/auth/types/auth";

let mockSessionActive = false;
let mockUser: User | null = null;

export function activateMockSession(user: User) {
  mockSessionActive = true;
  mockUser = user;
}

export function getMockSessionUser(): User | null {
  if (!mockSessionActive || !mockUser) {
    return null;
  }

  return mockUser;
}

export function clearMockSession() {
  mockSessionActive = false;
  mockUser = null;
}
