import { api } from './api';
import type { Company, CreateCompanyDTO, UpdateCompanyDTO } from '@shared/types';

export const companyService = {
  async getAll(): Promise<Company[]> {
    const response = await api.get<Company[]>('/companies');
    return response.data;
  },

  async getById(id: number): Promise<Company> {
    const response = await api.get<Company>(`/companies/${id}`);
    return response.data;
  },

  async create(data: CreateCompanyDTO): Promise<Company> {
    const response = await api.post<Company>('/companies', data);
    return response.data;
  },

  async update(id: number, data: UpdateCompanyDTO): Promise<Company> {
    const response = await api.put<Company>(`/companies/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/companies/${id}`);
  },
};
