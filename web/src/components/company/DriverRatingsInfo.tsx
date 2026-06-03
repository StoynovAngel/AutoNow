import type {Rating} from '../../services/rating/ratingService';

interface DriverRatingsInfoProps {
    ratings: Rating[];
    hasDriver: boolean;
}

const formatDate = (iso: string): string => {
    if (!iso) return '';
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString();
};

const Stars = ({value}: {value: number}) => {
    const full = Math.round(value);
    return (
        <span aria-label={`${value} out of 5 stars`}>
            {[1, 2, 3, 4, 5].map((i) => (
                <span key={i} className={i <= full ? 'text-yellow-400' : 'text-gray-300'}>
                    ★
                </span>
            ))}
        </span>
    );
};

const DriverRatingsInfo = ({ratings, hasDriver}: DriverRatingsInfoProps) => {
    if (!hasDriver) {
        return (
            <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100 flex-1 min-h-0 flex flex-col">
                <div className="flex flex-col items-center justify-center flex-1 text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                        <span className="text-gray-400 text-2xl leading-none">★</span>
                    </div>
                    <p className="text-gray-500 text-sm font-semibold">Reviews</p>
                    <p className="text-gray-400 text-xs mt-1">Select a driver to view reviews</p>
                </div>
            </div>
        );
    }

    if (ratings.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100 flex-1 min-h-0 flex flex-col">
                <h2 className="text-lg font-bold text-gray-800 mb-3">Reviews</h2>
                <div className="flex flex-col items-center justify-center flex-1 text-center">
                    <p className="text-gray-500 text-sm font-semibold">No reviews yet</p>
                    <p className="text-gray-400 text-xs mt-1">This driver hasn't received any reviews</p>
                </div>
            </div>
        );
    }

    const average = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;

    return (
        <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100 flex-1 min-h-0 flex flex-col">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-gray-800">Reviews</h2>
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    {ratings.length}
                </span>
            </div>
            <div className="flex items-center gap-2 mb-3 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                <span className="text-2xl font-bold text-gray-900">{average.toFixed(1)}</span>
                <div className="flex flex-col">
                    <Stars value={average}/>
                    <span className="text-xs text-gray-500">{ratings.length} review{ratings.length !== 1 ? 's' : ''}</span>
                </div>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1">
                {ratings.map((r) => (
                    <div key={r.id} className="bg-gray-50 border border-gray-200 rounded-lg p-2">
                        <div className="flex items-center justify-between mb-1">
                            <Stars value={r.rating}/>
                            <span className="text-xs text-gray-400">{formatDate(r.createdAt)}</span>
                        </div>
                        {r.comment && (
                            <p className="text-xs text-gray-700 whitespace-pre-wrap break-words">{r.comment}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DriverRatingsInfo;
