import client from "./client";
import type { Company } from "@/types/api";

export async function getCompanies(): Promise<Company[]> {
  const response = await client.get<Company[]>("/api/companies");
  return response.data;
}
