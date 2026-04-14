import axios from "axios";
import { API_URL } from "@/constants/config";
import { useAuthStore } from "@/stores/authStore";
import { translate } from "@/hooks/useTranslation";
import type { ProblemDetail } from "@/types/api";

const client = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

client.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        useAuthStore.getState().clearAuth();
      }

      const problem: ProblemDetail | undefined = error.response?.data;
      if (problem?.detail) {
        return Promise.reject(new ApiError(problem));
      }

      if (!error.response) {
        return Promise.reject(
          new Error(translate("errors.network")),
        );
      }
    }
    return Promise.reject(error);
  },
);

export class ApiError extends Error {
  fieldErrors?: Record<string, string>;

  constructor(problem: ProblemDetail) {
    super(problem.detail ?? translate("errors.generic"));
    this.name = "ApiError";
    this.fieldErrors = problem.properties?.errors as
      | Record<string, string>
      | undefined;
  }
}

export default client;
