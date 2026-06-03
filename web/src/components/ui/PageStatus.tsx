import Navigation from './Navigation.tsx';

interface PageStatusProps {
    state: 'loading' | 'error';
    title?: string;
    message?: string;
    onRetry?: () => void;
}

const PageStatus = ({ state, title, message, onRetry }: PageStatusProps) => {
    return (
        <>
            <Navigation />
            <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 pt-24 px-6 flex items-center justify-center">
                {state === 'loading' ? (
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-violet-600 mx-auto mb-4" />
                        <p className="text-xl text-gray-600">Loading...</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-lg p-8 max-w-md" role="alert" aria-live="assertive">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{title ?? 'Error Loading Data'}</h3>
                            {message && <p className="text-red-600 mb-4">{message}</p>}
                            {onRetry && (
                                <button
                                    onClick={onRetry}
                                    className="bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                                >
                                    Retry
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default PageStatus;
