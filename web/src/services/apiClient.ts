import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const isAuthEndpoint = config.url?.includes('/auth/');
        if (!isAuthEndpoint) {
            const token = localStorage.getItem("accessToken");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const extractErrorMessage = (data: unknown): string | null => {
    if (!data || typeof data !== "object") {
        return null;
    }
    const problem = data as { errors?: Record<string, string>; detail?: string };
    if (problem.errors && typeof problem.errors === "object") {
        const messages = Object.values(problem.errors).filter(Boolean);
        if (messages.length > 0) {
            return messages.join("\n");
        }
    }
    if (typeof problem.detail === "string" && problem.detail.trim()) {
        return problem.detail;
    }
    return null;
};

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const requestUrl: string = error.config?.url ?? '';
            const isAuthEndpoint = requestUrl.includes('/auth/');
            if (!isAuthEndpoint) {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("userInfo");
                window.location.href = "/login";
            }
        }

        const message = extractErrorMessage(error.response?.data);
        if (message) {
            error.message = message;
        }

        return Promise.reject(error);
    }
);

export default apiClient;
