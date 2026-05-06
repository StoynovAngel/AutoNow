import { Plus } from 'lucide-react';

export default function DriversPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Drivers</h1>
        <button className="flex items-center rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-700">
          <Plus className="mr-2 h-5 w-5" />
          Add Driver
        </button>
      </div>

      <div className="rounded-lg bg-white p-8 text-center shadow-sm">
        <p className="text-gray-500">
          Driver management coming soon. This page will allow you to manage drivers assigned to companies.
        </p>
      </div>
    </div>
  );
}
