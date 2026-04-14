import { useEffect } from "react";
import { useAuthStore, decodeEmail } from "@/stores/authStore";
import { getToken } from "@/stores/token";

export function useAuthState() {
  const { isHydrated, token, setAuth, clearAuth, setHydrated } = useAuthStore();

  useEffect(() => {
    if (isHydrated) return;

    (async () => {
      try {
        const stored = await getToken();
        if (stored) {
          const payload = stored.split(".")[1];
          const decoded = JSON.parse(atob(payload));
          const exp = decoded.exp;

          if (exp && exp * 1000 > Date.now()) {
            const email = decodeEmail(stored) ?? "";
            setAuth(stored, email);
          } else {
            clearAuth();
          }
        }
      } catch {
        clearAuth();
      } finally {
        setHydrated();
      }
    })();
  }, [isHydrated, setAuth, clearAuth, setHydrated]);

  return { isHydrated, isAuthenticated: !!token };
}
