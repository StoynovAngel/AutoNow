import { useMutation } from "@tanstack/react-query";
import { loginUser, registerUser } from "@/api/auth";
import { useAuthStore, decodeEmail } from "@/stores/authStore";

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      const email = decodeEmail(data.token) ?? "";
      setAuth(data.token, email);
    },
  });
}

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      const email = decodeEmail(data.token) ?? "";
      setAuth(data.token, email);
    },
  });
}
