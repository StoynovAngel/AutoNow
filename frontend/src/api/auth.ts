import client from "./client";
import type { AuthRequest, AuthResponse } from "@/types/api";

export async function loginUser(data: AuthRequest): Promise<AuthResponse> {
  const response = await client.post<AuthResponse>("/api/auth/login", data);
  return response.data;
}

export async function registerUser(data: AuthRequest): Promise<AuthResponse> {
  const response = await client.post<AuthResponse>("/api/auth/register", data);
  return response.data;
}
