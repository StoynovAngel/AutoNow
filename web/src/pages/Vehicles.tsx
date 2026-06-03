import { useState } from 'react';
import { Alert, Button, Select, TextInput } from 'flowbite-react';
import Navigation from '../components/ui/Navigation.tsx';
import PageStatus from '../components/ui/PageStatus';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import AddVehicleForm from '../components/vehicle/AddVehicleForm';
import VehicleInfo from '../components/company/VehicleInfo';
import { useVehicles } from '../hooks/useVehicles';
import type { Vehicle } from '../components/company/VehicleInfo';
import type { VehiclePayload } from '../services/vehicle/vehicleService';

const VEHICLE_TYPES = ['TAXI', 'SEMI', 'AMBULANCE', 'RENTAL', 'PROM', 'FUNERAL'] as const;

const Vehicles = () => {
    const { vehicles, loading, error, addVehicle, updateVehicle, removeVehicle, refreshVehicles } = useVehicles();
    const [showForm, setShowForm] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [filterType, setFilterType] = useState('');
    const [filterCompanyId, setFilterCompanyId] = useState<number | null>(null);

    const showSuccess = (msg: string) => {
        setSuccessMessage(msg);
        setTimeout(() => setSuccessMessage(null), 4000);
    };

    const handleAdd = async (payload: VehiclePayload) => {
        await addVehicle(payload);
        setShowForm(false);
        showSuccess(`${payload.brand} ${payload.model} added successfully.`);
    };

    const handleUpdate = async (payload: VehiclePayload) => {
        if (!editingVehicle) return;
        await updateVehicle(editingVehicle.id, payload);
        setEditingVehicle(null);
        showSuccess(`${payload.brand} ${payload.model} updated successfully.`);
    };

    const handleDeleteClick = (id: number) => {
        setDeletingId(id);
    };

    const handleDeleteConfirm = async () => {
        if (deletingId === null) return;
        await removeVehicle(deletingId);
        setDeletingId(null);
        showSuccess('Vehicle deleted.');
    };

    const handleEditClick = (vehicle: Vehicle) => {
        setShowForm(false);
        setEditingVehicle(vehicle);
    };

    const filteredVehicles = vehicles.filter(v => {
        if (filterType && v.vehicleType !== filterType) return false;
        if (filterCompanyId !== null && v.companyId !== filterCompanyId) return false;
        return true;
    });

    if (loading) {
        return <PageStatus state="loading" />;
    }

    if (error) {
        return <PageStatus state="error" title="Error Loading Vehicles" message={error} onRetry={refreshVehicles} />;
    }

    return (
        <>
            <Navigation />
            <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 pt-24 px-6 pb-6">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Vehicle Management</h1>
                            <p className="text-sm text-gray-600 mt-0.5">
                                {filteredVehicles.length}{filteredVehicles.length !== vehicles.length ? ` of ${vehicles.length}` : ''} vehicle{filteredVehicles.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                        <Button
                            color="purple"
                            onClick={() => { setShowForm(true); setEditingVehicle(null); setSuccessMessage(null); }}
                            size="sm"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Vehicle
                        </Button>
                    </div>

                    <div className="flex gap-3 mb-6">
                        <Select
                            value={filterType}
                            onChange={e => setFilterType(e.target.value)}
                            aria-label="Filter by vehicle type"
                        >
                            <option value="">All Types</option>
                            {VEHICLE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
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
                        {(filterType || filterCompanyId !== null) && (
                            <button
                                type="button"
                                onClick={() => { setFilterType(''); setFilterCompanyId(null); }}
                                className="text-sm text-gray-500 hover:text-gray-700 px-2 underline"
                            >
                                Clear
                            </button>
                        )}
                    </div>

                    {successMessage && (
                        <Alert color="success" aria-live="assertive" className="mb-4">
                            {successMessage}
                        </Alert>
                    )}

                    {showForm && (
                        <div className="mb-6">
                            <AddVehicleForm
                                onSubmit={handleAdd}
                                onCancel={() => setShowForm(false)}
                            />
                        </div>
                    )}

                    {editingVehicle && (
                        <div className="mb-6">
                            <AddVehicleForm
                                initialData={editingVehicle}
                                onSubmit={handleUpdate}
                                onCancel={() => setEditingVehicle(null)}
                            />
                        </div>
                    )}

                    <VehicleInfo
                        vehicles={filteredVehicles}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteClick}
                    />
                </div>
            </div>

            <ConfirmDialog
                open={deletingId !== null}
                title="Delete Vehicle"
                message="Are you sure? This cannot be undone."
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeletingId(null)}
            />
        </>
    );
};

export default Vehicles;
