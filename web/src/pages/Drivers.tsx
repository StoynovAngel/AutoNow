import { useState } from 'react';
import { Alert, Button, Select, TextInput } from 'flowbite-react';
import Navigation from '../components/ui/Navigation.tsx';
import PageStatus from '../components/ui/PageStatus.tsx';
import ConfirmDialog from '../components/ui/ConfirmDialog.tsx';
import AddDriverForm from '../components/driver/AddDriverForm';
import DriverCard from '../components/driver/DriverCard';
import AssignVehicleModal from '../components/driver/AssignVehicleModal';
import { useAllDrivers } from '../hooks/useAllDrivers';
import { useVehicles } from '../hooks/useVehicles';
import { useAuth } from '../contexts/AuthContext';
import type { Driver } from '../components/company/DriverInfo';
import type { DriverPayload } from '../services/driver/driverService';
import { COMPANY_TYPES } from '../services/company/companyService';

const EXPERTISE_TYPES = ['AM', 'A1', 'A2', 'A', 'B1', 'B', 'BE', 'C1', 'C1E', 'C', 'CE', 'D1', 'D1E', 'D', 'DE', 'Tkt'] as const;

const Drivers = () => {
    const { user } = useAuth();
    const isCompanyAdmin = user?.authorities?.includes('ROLE_COMPANY_ADMIN') ?? false;
    const companyId = isCompanyAdmin ? (user?.companyId ?? null) : null;

    const [filterCompanyType, setFilterCompanyType] = useState<string>('');
    const { drivers, loading, error, addDriver, updateDriver, removeDriver, assignVehicle, unassignVehicle, refreshDrivers } = useAllDrivers(filterCompanyType || null, companyId);

    const [showForm, setShowForm] = useState(false);
    const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [assigningDriver, setAssigningDriver] = useState<Driver | null>(null);

    const { vehicles } = useVehicles(assigningDriver?.companyId ?? null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [filterType, setFilterType] = useState('');
    const [filterCompanyId, setFilterCompanyId] = useState<number | null>(null);
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
        if (filterCompanyId !== null && d.companyId !== filterCompanyId) return false;
        if (searchName.trim()) {
            const fullName = `${d.firstName} ${d.lastName}`.toLowerCase();
            if (!fullName.includes(searchName.trim().toLowerCase())) return false;
        }
        return true;
    });

    if (loading) {
        return <PageStatus state="loading" />;
    }

    if (error) {
        return <PageStatus state="error" title="Error Loading Drivers" message={error} onRetry={refreshDrivers} />;
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
                        <Button
                            onClick={() => { setShowForm(true); setEditingDriver(null); setSuccessMessage(null); }}
                            size="sm"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Driver
                        </Button>
                    </div>

                    <div className="flex gap-3 mb-6">
                        <Select
                            value={filterCompanyType}
                            onChange={e => setFilterCompanyType(e.target.value)}
                            aria-label="Filter by company type"
                            className="w-48"
                        >
                            <option value="">Company Types</option>
                            {COMPANY_TYPES.map(t => (
                                <option key={t} value={t}>{t.charAt(0) + t.slice(1).toLowerCase()}</option>
                            ))}
                        </Select>
                        <Select
                            value={filterType}
                            onChange={e => setFilterType(e.target.value)}
                            aria-label="Filter by license type"
                            className="w-48"
                        >
                            <option value="">License Types</option>
                            {EXPERTISE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </Select>
                        <TextInput
                            type="number"
                            min={1}
                            value={filterCompanyId ?? ''}
                            onChange={e => {
                                const v = e.target.value;
                                if (v === '') return setFilterCompanyId(null);
                                const n = Number(v);
                                setFilterCompanyId(Number.isFinite(n) ? n : null);
                            }}
                            placeholder="Filter by Company ID"
                            className="w-48"
                            aria-label="Filter by company ID"
                        />
                        <TextInput
                            type="text"
                            value={searchName}
                            onChange={e => setSearchName(e.target.value)}
                            placeholder="Search by name"
                            className="flex-1"
                            aria-label="Search drivers by name"
                        />
                        {(filterCompanyType || filterType || filterCompanyId !== null || searchName.trim()) && (
                            <Button
                                type="button"
                                color="light"
                                size="sm"
                                onClick={() => { setFilterCompanyType(''); setFilterType(''); setFilterCompanyId(null); setSearchName(''); }}
                            >
                                Clear
                            </Button>
                        )}
                    </div>

                    {successMessage && (
                        <Alert color="success" aria-live="assertive" className="mb-4">
                            {successMessage}
                        </Alert>
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

            <ConfirmDialog
                open={deletingId !== null}
                title="Delete Driver"
                message="Are you sure? This cannot be undone."
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeletingId(null)}
            />

            {assigningDriver && (
                <AssignVehicleModal
                    driver={assigningDriver}
                    allVehicles={vehicles}
                    takenVehicleIds={new Set(
                        drivers
                            .filter(d => d.id !== assigningDriver.id)
                            .flatMap(d => d.vehicleIds)
                    )}
                    onAssign={handleAssign}
                    onUnassign={handleUnassign}
                    onClose={() => setAssigningDriver(null)}
                />
            )}
        </>
    );
};

export default Drivers;
