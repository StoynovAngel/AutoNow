import { Alert, Button, Spinner } from 'flowbite-react';
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
                        <Spinner size="xl" aria-label="Loading" className="mb-4" />
                        <p className="text-xl text-gray-600">Loading...</p>
                    </div>
                ) : (
                    <div className="max-w-md w-full">
                        <Alert color="failure" aria-live="assertive">
                            <div className="text-center">
                                <h3 className="text-xl font-bold mb-2">{title ?? 'Error Loading Data'}</h3>
                                {message && <p className="mb-4">{message}</p>}
                                {onRetry && (
                                    <Button onClick={onRetry} size="sm">
                                        Retry
                                    </Button>
                                )}
                            </div>
                        </Alert>
                    </div>
                )}
            </div>
        </>
    );
};

export default PageStatus;
