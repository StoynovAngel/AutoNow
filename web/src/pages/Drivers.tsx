import { useState } from 'react';
import Navigation from '../components/Navigation';
import AddDriverForm from '../components/driver/AddDriverForm';
import DriverCard from '../components/driver/DriverCard';
import AssignVehicleModal from '../components/driver/AssignVehicleModal';
import { useAllDrivers } from '../hooks/useAllDrivers';
import { useVehicles } from '../hooks/useVehicles';
import type { Driver } from '../components/company/DriverInfo';
import type { DriverPayload } from '../services/driver/driverService';

const EXPERTISE_TYPES = ['AM', 'A1', 'A2', 'A', 'B1', 'B', 'BE', 'C1', 'C1E', 'C', 'CE', 'D1', 'D1E', 'D', 'DE', 'Tkt'] as const;

const Drivers = () => {
    const { drivers, loading, error, addDriver, updateDriver, removeDriver, assignVehicle, unassignVehicle, refreshDrivers } = useAllDrivers();
    const { vehicles } = useVehicles();

    const [showForm, setShowForm] = useState(false);
    const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [assigningDriver, setAssigningDriver] = useState<Driver | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [filterType, setFilterType] = useState('');
    const [filterCompanyId, setFilterCompanyId] = useState('');
    const [searchName, setSearchName] = useState('');

    const showSuccess = (msg: string) => {
        setSuccessMessage(msg);
        setTimeout(() => setSuccessMessage(null), 4000);
    };

    const handleAdd = async (payload: DriverPayload) => {
        await addDriver(payload);
        setShowForm(false);
        showSuccess(`${payload.firstName} ${payload.lastName} added successfully.`);
    };

    const handleUpdate = async (payload: DriverPayload) => {
        if (!editingDriver) return;
        await updateDriver(editingDriver.id, payload);
        setEditingDriver(null);
        showSuccess(`${payload.firstName} ${payload.lastName} updated successfully.`);
    };

    const handleDeleteConfirm = async () => {
        if (deletingId === null) return;
        await removeDriver(deletingId);
        setDeletingId(null);
        showSuccess('Driver deleted.');
    };

    const handleAssign = async (vehicleId: number) => {
        if (!assigningDriver) return;
        await assignVehicle(assigningDriver.id, vehicleId);
        // refresh the assigning driver state so the modal reflects the updated vehicleIds
        const updated = drivers.find(d => d.id === assigningDriver.id);
        if (updated) setAssigningDriver({ ...updated, vehicleIds: [...updated.vehicleIds, vehicleId] });
    };

    const handleUnassign = async (vehicleId: number) => {
        if (!assigningDriver) return;
        await unassignVehicle(assigningDriver.id, vehicleId);
        const updated = drivers.find(d => d.id === assigningDriver.id);
        if (updated) setAssigningDriver({ ...updated, vehicleIds: updated.vehicleIds.filter(id => id !== vehicleId) });
    };

    const filteredDrivers = drivers.filter(d => {
        if (filterType && !d.expertiseType.includes(filterType)) return false;
        if (filterCompanyId && String(d.companyId) !== filterCompanyId.trim()) return false;
        if (searchName.trim()) {
            const fullName = `${d.firstName} ${d.lastName}`.toLowerCase();
            if (!fullName.includes(searchName.trim().toLowerCase())) return false;
        }
        return true;
    });

    if (loading) {
        return (
            <>
                <Navigation />
                <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 pt-24 px-6 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-violet-600 mx-auto mb-4" />
                        <p className="text-xl text-gray-600">Loading...</p>
                    </div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navigation />
                <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 pt-24 px-6 flex items-center justify-center">
                    <div className="bg-white rounded-xl shadow-lg p-8 max-w-md">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Error Loading Drivers</h3>
                            <p className="text-red-600 mb-4">{error}</p>
                            <button onClick={refreshDrivers} className="bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
                                Retry
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navigation />
            <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 pt-24 px-6 pb-6">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Driver Management</h1>
                            <p className="text-sm text-gray-600 mt-0.5">
                                {filteredDrivers.length}{filteredDrivers.length !== drivers.length ? ` of ${drivers.length}` : ''} driver{filteredDrivers.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                        <button
                            onClick={() => { setShowForm(true); setEditingDriver(null); setSuccessMessage(null); }}
                            className="bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Driver
                        </button>
                    </div>

                    <div className="flex gap-3 mb-6">
                        <select
                            value={filterType}
                            onChange={e => setFilterType(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
                            aria-label="Filter by license type"
                        >
                            <option value="">All License Types</option>
                            {EXPERTISE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <input
                            type="number"
                            min={1}
                            value={filterCompanyId}
                            onChange={e => setFilterCompanyId(e.target.value)}
                            placeholder="Filter by Company ID"
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-violet-500 w-48"
                            aria-label="Filter by company ID"
                        />
                        <input
                            type="text"
                            value={searchName}
                            onChange={e => setSearchName(e.target.value)}
                            placeholder="Search by name"
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-violet-500 flex-1"
                            aria-label="Search drivers by name"
                        />
                        {(filterType || filterCompanyId || searchName) && (
                            <button type="button" onClick={() => { setFilterType(''); setFilterCompanyId(''); setSearchName(''); }} className="text-sm text-gray-500 hover:text-gray-700 px-2 underline">
                                Clear
                            </button>
                        )}
                    </div>

                    {successMessage && (
                        <div role="alert" aria-live="assertive" className="mb-4 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm">
                            {successMessage}
                        </div>
                    )}

                    {showForm && (
                        <div className="mb-6">
                            <AddDriverForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} />
                        </div>
                    )}

                    {editingDriver && (
                        <div className="mb-6">
                            <AddDriverForm initialData={editingDriver} onSubmit={handleUpdate} onCancel={() => setEditingDriver(null)} />
                        </div>
                    )}

                    {filteredDrivers.length === 0 ? (
                        <div className="text-center py-16 text-gray-400">
                            <svg className="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <p className="text-sm font-medium">No drivers found</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-4">
                            {filteredDrivers.map((driver, index) => (
                                <DriverCard
                                    key={driver.id}
                                    driver={driver}
                                    index={index}
                                    onEdit={d => { setShowForm(false); setEditingDriver(d); }}
                                    onDelete={setDeletingId}
                                    onAssign={setAssigningDriver}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {deletingId !== null && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Driver</h3>
                        <p className="text-gray-600 text-sm mb-6">Are you sure? This cannot be undone.</p>
                        <div className="flex gap-3">
                            <button onClick={handleDeleteConfirm} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm">Delete</button>
                            <button onClick={() => setDeletingId(null)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors text-sm">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {assigningDriver && (
                <AssignVehicleModal
                    driver={assigningDriver}
                    allVehicles={vehicles}
                    onAssign={handleAssign}
                    onUnassign={handleUnassign}
                    onClose={() => setAssigningDriver(null)}
                />
            )}
        </>
    );
};

export default Drivers;
