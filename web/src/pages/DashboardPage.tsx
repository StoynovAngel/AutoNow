import { Building2, Users, Car, UserCog } from 'lucide-react';

const stats = [
  { label: 'Companies', value: '-', icon: Building2, color: 'bg-blue-500' },
  { label: 'Drivers', value: '-', icon: Users, color: 'bg-green-500' },
  { label: 'Vehicles', value: '-', icon: Car, color: 'bg-yellow-500' },
  { label: 'Users', value: '-', icon: UserCog, color: 'bg-purple-500' },
];

export default function DashboardPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-lg bg-white p-6 shadow-sm"
            >
              <div className="flex items-center">
                <div className={`rounded-lg p-3 ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Welcome to AutoNow Admin
        </h2>
        <p className="text-gray-600">
          Use the sidebar to manage companies, drivers, vehicles, and users.
        </p>
      </div>
    </div>
  );
}
