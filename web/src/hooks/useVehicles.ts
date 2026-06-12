import { useState, useEffect } from 'react';
import { vehicleService } from '../services/vehicle/vehicleService';
import type { Vehicle } from '../components/company/VehicleInfo';
import type { VehiclePayload } from '../services/vehicle/vehicleService';

export const useVehicles = (companyId?: number | null, isCompanyAdmin?: boolean) => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchVehicles = async () => {
        setLoading(true);
        setError(null);
        try {
            let data: Vehicle[];
            if (isCompanyAdmin) {
                data = await vehicleService.getMyVehicles();
            } else if (companyId) {
                data = await vehicleService.getVehiclesByCompany(String(companyId));
            } else {
                data = await vehicleService.getAllVehicles();
            }
            setVehicles(data);
            setSelectedVehicleId((prevId) => {
                if (prevId && !data.find((v: Vehicle) => v.id === prevId)) {
                    setSelectedVehicle(null);
                    return null;
                }
                return prevId;
            });
        } catch (err: unknown) {
            setError('Failed to load vehicles');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, [companyId, isCompanyAdmin]);

    const selectVehicle = async (vehicleId: number) => {
        setSelectedVehicleId(vehicleId);
        if (vehicleId) {
            try {
                const data = await vehicleService.getVehicleById(String(vehicleId));
                setSelectedVehicle(data);
            } catch {
                setSelectedVehicle(null);
            }
        } else {
            setSelectedVehicle(null);
        }
    };

    const addVehicle = async (payload: VehiclePayload): Promise<Vehicle> => {
        const created = await vehicleService.createVehicle(payload);
        await fetchVehicles();
        return created;
    };

    const updateVehicle = async (id: number, payload: VehiclePayload): Promise<Vehicle> => {
        const updated = await vehicleService.updateVehicle(String(id), payload);
        await fetchVehicles();
        return updated;
    };

    const removeVehicle = async (id: number): Promise<void> => {
        await vehicleService.deleteVehicle(String(id));
        if (selectedVehicleId === id) {
            setSelectedVehicleId(null);
            setSelectedVehicle(null);
        }
        await fetchVehicles();
    };

    return {
        vehicles,
        selectedVehicleId,
        selectedVehicle,
        loading,
        error,
        selectVehicle,
        addVehicle,
        updateVehicle,
        removeVehicle,
        refreshVehicles: fetchVehicles,
    };
};
