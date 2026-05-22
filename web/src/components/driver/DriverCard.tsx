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
    <div className="bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500 text-white rounded-lg shadow-lg overflow-hidden">
        <div className="w-full h-72 overflow-hidden bg-white/10">
            <img
                src={driver.imageUrl ?? profilePicture}
                alt={`${driver.firstName} ${driver.lastName}`}
                className="w-full h-full object-cover"
            />
        </div>

        <div className="p-3">
            <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                    <div className="flex items-center gap-1 mb-1.5">
                        <span className="text-violet-100 text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">
                            #{index + 1}
                        </span>
                        <span className="text-violet-100 text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">
                            {driver.expertiseType}
                        </span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${driver.available ? 'bg-green-400/30 text-green-100' : 'bg-red-400/30 text-red-100'}`}>
                            {driver.available ? 'Available' : 'Unavailable'}
                        </span>
                    </div>
                    <p className="font-bold text-lg mb-0.5">{driver.firstName} {driver.lastName}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="bg-white/15 backdrop-blur-sm p-2 rounded-lg">
                    <span className="text-xs text-violet-100 font-semibold block mb-0.5">PHONE</span>
                    <p className="text-xs font-bold truncate">{driver.phoneNumber}</p>
                </div>
                <div className="bg-white/15 backdrop-blur-sm p-2 rounded-lg">
                    <span className="text-xs text-violet-100 font-semibold block mb-0.5">VEHICLES</span>
                    <p className="text-sm font-bold">{driver.vehicleIds.length}</p>
                </div>
            </div>

            {driver.companyId && (
                <div className="flex items-center bg-white/15 backdrop-blur-sm p-2 rounded-lg mb-2">
                    <svg className="w-3.5 h-3.5 mr-1.5 text-violet-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="font-semibold text-xs">Company ID: {driver.companyId}</span>
                </div>
            )}

            <div className="mt-2 pt-2 border-t border-white/20">
                <div className="flex items-center justify-between">
                    <span className="text-xs text-violet-100 font-semibold">DRIVER ID #{driver.id}</span>
                    <div className="flex gap-1.5">
                        <button
                            type="button"
                            onClick={() => onAssign(driver)}
                            className="bg-white/20 hover:bg-white/30 text-white px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                            Assign
                        </button>
                        <button
                            type="button"
                            onClick={() => onEdit(driver)}
                            className="bg-white/20 hover:bg-white/30 text-white px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                        </button>
                        <button
                            type="button"
                            onClick={() => onDelete(driver.id)}
                            className="bg-red-500/40 hover:bg-red-500/60 text-white px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
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
