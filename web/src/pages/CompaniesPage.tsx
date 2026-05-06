import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { companyService } from '../services/companyService';
import { VehicleType } from '@shared/types';
import type { Company, CreateCompanyDTO } from '@shared/types';

const vehicleTypeLabels: Record<VehicleType, string> = {
  [VehicleType.AMBULANCE]: 'Ambulance',
  [VehicleType.LOGISTICS]: 'Logistics',
  [VehicleType.TAXI]: 'Taxi',
  [VehicleType.RENTAL]: 'Rental',
  [VehicleType.FUNERAL]: 'Funeral',
  [VehicleType.PROM]: 'Prom',
};

export default function CompaniesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const queryClient = useQueryClient();

  const { data: companies = [], isLoading } = useQuery({
    queryKey: ['companies'],
    queryFn: companyService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: companyService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      setIsModalOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateCompanyDTO> }) =>
      companyService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      setIsModalOpen(false);
      setEditingCompany(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: companyService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });

  const handleSubmit = (data: CreateCompanyDTO) => {
    if (editingCompany) {
      updateMutation.mutate({ id: editingCompany.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this company?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
        <button
          onClick={() => {
            setEditingCompany(null);
            setIsModalOpen(true);
          }}
          className="flex items-center rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
        >
          <Plus className="mr-2 h-5 w-5" />
          Add Company
        </button>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {companies.map((company) => (
              <tr key={company.id}>
                <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                  {company.name}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-gray-500">
                  {vehicleTypeLabels[company.companyType]}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-gray-500">
                  {company.email || '-'}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-gray-500">
                  {company.phone || '-'}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      company.isActive !== false
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {company.isActive !== false ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right">
                  <button
                    onClick={() => handleEdit(company)}
                    className="mr-2 text-primary-600 hover:text-primary-800"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(company.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
            {companies.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-8 text-center text-gray-500"
                >
                  No companies found. Click "Add Company" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <CompanyModal
          company={editingCompany}
          onClose={() => {
            setIsModalOpen(false);
            setEditingCompany(null);
          }}
          onSubmit={handleSubmit}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      )}
    </div>
  );
}

interface CompanyModalProps {
  company: Company | null;
  onClose: () => void;
  onSubmit: (data: CreateCompanyDTO) => void;
  isLoading: boolean;
}

function CompanyModal({ company, onClose, onSubmit, isLoading }: CompanyModalProps) {
  const [formData, setFormData] = useState<CreateCompanyDTO>({
    name: company?.name || '',
    description: company?.description || '',
    phone: company?.phone || '',
    email: company?.email || '',
    address: company?.address || '',
    companyType: company?.companyType || VehicleType.TAXI,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-bold text-gray-900">
          {company ? 'Edit Company' : 'Add Company'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none"
              required
            />
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Type *
            </label>
            <select
              value={formData.companyType}
              onChange={(e) =>
                setFormData({ ...formData, companyType: e.target.value as VehicleType })
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none"
            >
              {Object.entries(vehicleTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none"
            />
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none"
            />
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none"
            />
          </div>

          <div className="mb-6">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-700 disabled:bg-primary-300"
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
