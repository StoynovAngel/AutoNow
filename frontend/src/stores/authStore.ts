import { create } from "zustand";
import { saveToken, deleteToken } from "./token";

interface AuthState {
  token: string | null;
  userEmail: string | null;
  isHydrated: boolean;
  setAuth: (token: string, email: string) => void;
  clearAuth: () => void;
  setHydrated: () => void;
}

function decodeEmail(token: string): string | null {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return decoded.sub ?? null;
  } catch {
    return null;
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  userEmail: null,
  isHydrated: false,

  setAuth: (token, email) => {
    set({ token, userEmail: email });
    saveToken(token);
  },

  clearAuth: () => {
    set({ token: null, userEmail: null });
    deleteToken();
  },

  setHydrated: () => set({ isHydrated: true }),
}));

export { decodeEmail };
