import { create } from "zustand";

import { bootstrapAuth } from "@/features/auth/lib/bootstrap-auth";
import type { User } from "@/features/auth/types/auth";

export type AuthStatus =
  | "idle"
  | "bootstrapping"
  | "authenticated"
  | "unauthenticated";

type AuthState = {
  user: User | null;
  status: AuthStatus;
  setUser: (user: User) => void;
  clearUser: () => void;
  setStatus: (status: AuthStatus) => void;
  refreshUser: () => Promise<User | null>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: "idle",
  setUser: (user) => set({ user, status: "authenticated" }),
  clearUser: () => set({ user: null, status: "unauthenticated" }),
  setStatus: (status) => set({ status }),
  refreshUser: async () => {
    const user = await bootstrapAuth();

    if (user) {
      set({ user, status: "authenticated" });
    } else {
      set({ user: null, status: "unauthenticated" });
    }

    return user;
  },
}));

export function useAuthUser() {
  return useAuthStore((state) => state.user);
}

export function useAuthStatus() {
  return useAuthStore((state) => state.status);
}

export function useIsAuthenticated() {
  return useAuthStore((state) => state.status === "authenticated");
}
