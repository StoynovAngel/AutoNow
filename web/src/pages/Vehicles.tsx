import { useState } from 'react';
import Navigation from '../components/Navigation';
import AddVehicleForm from '../components/vehicle/AddVehicleForm';
import VehicleInfo from '../components/company/VehicleInfo';
import { useVehicles } from '../hooks/useVehicles';
import type { Vehicle } from '../components/company/VehicleInfo';
import type { VehiclePayload } from '../services/company/vehicleService';

const Vehicles = () => {
    const { vehicles, loading, error, addVehicle, updateVehicle, removeVehicle, refreshVehicles } = useVehicles();
    const [showForm, setShowForm] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Error Loading Vehicles</h3>
                            <p className="text-red-600 mb-4">{error}</p>
                            <button
                                onClick={refreshVehicles}
                                className="bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                            >
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
                            <h1 className="text-2xl font-bold text-gray-900">Vehicle Management</h1>
                            <p className="text-sm text-gray-600 mt-0.5">
                                {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''} registered
                            </p>
                        </div>
                        <button
                            onClick={() => { setShowForm(true); setEditingVehicle(null); setSuccessMessage(null); }}
                            className="bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Vehicle
                        </button>
                    </div>

                    {successMessage && (
                        <div role="alert" aria-live="assertive" className="mb-4 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm">
                            {successMessage}
                        </div>
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
                        vehicles={vehicles}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteClick}
                    />
                </div>
            </div>

            {deletingId !== null && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Vehicle</h3>
                        <p className="text-gray-600 text-sm mb-6">Are you sure? This cannot be undone.</p>
                        <div className="flex gap-3">
                            <button
                                onClick={handleDeleteConfirm}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => setDeletingId(null)}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Vehicles;
