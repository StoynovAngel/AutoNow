import type { Driver } from './DriverInfo';

interface DriverListProps {
    drivers: Driver[];
    selectedDriverId: number | null;
    onSelectDriver: (driverId: number) => void;
    onAddDriver: () => void;
}

const DriverList = ({drivers, selectedDriverId, onSelectDriver, onAddDriver}: DriverListProps) => {
    return (
        <div className="w-64 bg-white rounded-lg shadow-lg p-4 flex flex-col">
            <div className="flex-1 space-y-2 mb-4 overflow-y-auto">
                {drivers.map((driver) => (
                    <div
                        key={driver.id}
                        onClick={() => onSelectDriver(driver.id)}
                        className={`px-3 py-2 border rounded-lg cursor-pointer transition ${
                            selectedDriverId === driver.id
                                ? "bg-violet-100 border-violet-500"
                                : "bg-white border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                        {driver.firstName} {driver.lastName}
                    </div>
                ))}
            </div>

            <button
                onClick={onAddDriver}
                className="w-full px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition"
            >
                Add new driver
            </button>
        </div>
    );
};

export default DriverList;
