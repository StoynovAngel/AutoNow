export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface ProblemDetail {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  properties?: {
    errors?: Record<string, string>;
    [key: string]: unknown;
  };
}

export type CompanyType = "TAXI" | "LOGISTICS" | "AMBULANCE" | "MOVING" | "RENTAL";

export interface Company {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  logoUrl: string | null;
  description: string | null;
  companyType: CompanyType;
  createdAt: string;
  updatedAt: string;
}
