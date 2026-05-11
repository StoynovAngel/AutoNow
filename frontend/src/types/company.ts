import { VehicleType } from './vehicle';

export interface Company {
    id: number;
    name: string;
    description?: string;
    phone?: string;
    email?: string;
    address?: string;
    rating?: number;
    logoUrl?: string;
    companyType: VehicleType;
    isActive?: boolean;
    distance?: number;
}

export interface CompanyListResponse {
    companies: Company[];
    totalCount: number;
}

export interface CreateCompanyDTO {
    name: string;
    description?: string;
    phone?: string;
    email?: string;
    address?: string;
    companyType: VehicleType;
}

export interface UpdateCompanyDTO {
    name?: string;
    description?: string;
    phone?: string;
    email?: string;
    address?: string;
    companyType?: VehicleType;
}
