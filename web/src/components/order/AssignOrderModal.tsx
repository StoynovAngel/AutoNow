import { useMemo, useState } from 'react';
import { Alert, Button, Label, Modal, ModalBody, ModalFooter, ModalHeader, Select } from 'flowbite-react';
import type { Driver } from '../company/DriverInfo';
import type { Vehicle } from '../company/VehicleInfo';
import type { Order } from './OrderInfo';

interface AssignOrderModalProps {
    order: Order;
    drivers: Driver[];
    vehicles: Vehicle[];
    onAssign: (driverId: number, vehicleId: number) => Promise<void>;
    onClose: () => void;
}

const AssignOrderModal = ({ order, drivers, vehicles, onAssign, onClose }: AssignOrderModalProps) => {
    const [driverId, setDriverId] = useState<number | null>(order.driverId ?? null);
    const [vehicleId, setVehicleId] = useState<number | null>(order.vehicleId ?? null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const eligibleDrivers = useMemo(() => {
        const matchingVehicleIds = new Set(
            vehicles.filter((v) => v.vehicleType === order.vehicleType).map((v) => v.id),
        );
        return drivers.filter(
            (d) =>
                d.available &&
                d.vehicleIds.some((id) => matchingVehicleIds.has(id)),
        );
    }, [drivers, vehicles, order.vehicleType]);

    const selectedDriver = useMemo(
        () => eligibleDrivers.find((d) => d.id === driverId) ?? null,
        [eligibleDrivers, driverId],
    );

    const eligibleVehicles = useMemo(() => {
        if (!selectedDriver) return [];
        const ids = new Set(selectedDriver.vehicleIds);
        return vehicles.filter(
            (v) => ids.has(v.id) && v.vehicleType === order.vehicleType,
        );
    }, [selectedDriver, vehicles, order.vehicleType]);

    const canSubmit = driverId !== null && vehicleId !== null && !submitting;

    const handleDriverChange = (value: string) => {
        const next = value ? Number(value) : null;
        setDriverId(next);
        setVehicleId(null);
        setError(null);
    };

    const handleVehicleChange = (value: string) => {
        setVehicleId(value ? Number(value) : null);
        setError(null);
    };

    const handleSubmit = async () => {
        if (driverId === null || vehicleId === null) return;
        setSubmitting(true);
        setError(null);
        try {
            await onAssign(driverId, vehicleId);
            onClose();
        } catch {
            setError('Assignment failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const isReassign = order.status !== 'CREATED' && order.driverId != null;

    return (
        <Modal show onClose={onClose} size="lg" dismissible>
            <ModalHeader>
                {isReassign ? 'Reassign Order' : 'Assign Order'} — #{order.id}
            </ModalHeader>
            <ModalBody>
                {error && (
                    <Alert color="failure" aria-live="assertive" className="mb-3">
                        {error}
                    </Alert>
                )}

                <div className="space-y-4">
                    <div>
                        <Label htmlFor={`assign-driver-${order.id}`} className="mb-1 block">
                            Driver ({order.vehicleType})
                        </Label>
                        <Select
                            id={`assign-driver-${order.id}`}
                            value={driverId ?? ''}
                            onChange={(e) => handleDriverChange(e.target.value)}
                            disabled={eligibleDrivers.length === 0}
                        >
                            <option value="">
                                {eligibleDrivers.length === 0
                                    ? 'No available drivers for this service'
                                    : 'Select a driver'}
                            </option>
                            {eligibleDrivers.map((d) => (
                                <option key={d.id} value={d.id}>
                                    {d.firstName} {d.lastName} · {d.phoneNumber}
                                </option>
                            ))}
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor={`assign-vehicle-${order.id}`} className="mb-1 block">
                            Vehicle
                        </Label>
                        <Select
                            id={`assign-vehicle-${order.id}`}
                            value={vehicleId ?? ''}
                            onChange={(e) => handleVehicleChange(e.target.value)}
                            disabled={!selectedDriver || eligibleVehicles.length === 0}
                        >
                            <option value="">
                                {!selectedDriver
                                    ? 'Select a driver first'
                                    : eligibleVehicles.length === 0
                                        ? 'No matching vehicles for this driver'
                                        : 'Select a vehicle'}
                            </option>
                            {eligibleVehicles.map((v) => (
                                <option key={v.id} value={v.id}>
                                    {v.brand} {v.model} · {v.licensePlate} · {v.numberOfSeats} seats
                                </option>
                            ))}
                        </Select>
                    </div>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button color="gray" onClick={onClose} disabled={submitting}>
                    Cancel
                </Button>
                <Button color="blue" onClick={handleSubmit} disabled={!canSubmit}>
                    {submitting ? 'Assigning...' : isReassign ? 'Reassign' : 'Assign'}
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default AssignOrderModal;
