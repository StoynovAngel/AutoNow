import { useCallback, useEffect, useRef, useState } from 'react';
import { parseApiError } from '../utils/errorParser';

export type DataFetchState<T> = {
    data: T;
    loading: boolean;
    error: string;
    reload: () => Promise<void>;
};

export const useDataFetch = <T>(loader: () => Promise<T>, initialData: T): DataFetchState<T> => {
    const [data, setData] = useState<T>(initialData);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loaderRef = useRef(loader);
    loaderRef.current = loader;
    const requestIdRef = useRef(0);

    const reload = useCallback(async () => {
        const requestId = ++requestIdRef.current;
        setLoading(true);
        setError('');
        try {
            const result = await loaderRef.current();
            if (requestId !== requestIdRef.current) return;
            setData(result);
        } catch (err) {
            if (requestId !== requestIdRef.current) return;
            setError(parseApiError(err));
        } finally {
            if (requestId === requestIdRef.current) {
                setLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        reload();
    }, [reload, loader]);

    return { data, loading, error, reload };
};
