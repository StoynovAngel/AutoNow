import type { Driver } from '../company/DriverInfo';
import profilePicture from '../../assets/profile-picture.png';

interface DriverCardProps {
    driver: Driver;
    index: number;
    onEdit: (driver: Driver) => void;
    onDelete: (id: number) => void;
    onAssign: (driver: Driver) => void;
}

const DriverCard = ({ driver, index, onEdit, onDelete, onAssign }: DriverCardProps) => (
    <div className="flex flex-col bg-white border border-gray-200 text-gray-900 rounded-lg shadow-sm overflow-hidden h-full">
        <div className="w-full h-72 overflow-hidden bg-gray-100">
            <img
                src={driver.imageUrl ?? profilePicture}
                alt={`${driver.firstName} ${driver.lastName}`}
                className="w-full h-full object-cover"
            />
        </div>

        <div className="p-3 flex flex-col flex-1">
            <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                        <span className="text-brand-700 text-xs font-bold bg-brand-100 px-2.5 py-1 rounded-full">
                            #{index + 1}
                        </span>
                        {driver.expertiseType.map(t => (
                            <span key={t} className="text-brand-700 text-xs font-bold bg-brand-100 px-2.5 py-1 rounded-full">
                                {t}
                            </span>
                        ))}
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${driver.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {driver.available ? 'Available' : 'Unavailable'}
                        </span>
                    </div>
                    <p className="font-bold text-lg mb-0.5 text-gray-900">{driver.firstName} {driver.lastName}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="bg-gray-50 border border-gray-200 p-2 rounded-lg">
                    <span className="text-xs text-gray-500 font-semibold block mb-0.5">PHONE</span>
                    <p className="text-xs font-bold truncate text-gray-900">{driver.phoneNumber}</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 p-2 rounded-lg">
                    <span className="text-xs text-gray-500 font-semibold block mb-0.5">VEHICLES</span>
                    <p className="text-sm font-bold text-gray-900">{driver.vehicleIds.length}</p>
                </div>
            </div>

            {driver.companyId && (
                <div className="flex items-center bg-gray-50 border border-gray-200 p-2 rounded-lg mb-2">
                    <svg className="w-3.5 h-3.5 mr-1.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="font-semibold text-xs text-gray-700">Company ID: {driver.companyId}</span>
                </div>
            )}

            <div className="mt-auto pt-2 border-t border-gray-200">
                <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-semibold">DRIVER ID #{driver.id}</span>
                    <div className="flex gap-1.5">
                        <button
                            type="button"
                            onClick={() => onAssign(driver)}
                            className="bg-brand-500 hover:bg-brand-600 text-white px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                            Assign
                        </button>
                        <button
                            type="button"
                            onClick={() => onEdit(driver)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                        </button>
                        <button
                            type="button"
                            onClick={() => onDelete(driver.id)}
                            className="bg-red-100 hover:bg-red-200 text-red-700 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default DriverCard;
