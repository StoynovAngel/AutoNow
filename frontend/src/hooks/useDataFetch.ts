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

    const reload = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const result = await loaderRef.current();
            setData(result);
        } catch (err) {
            setError(parseApiError(err));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        reload();
    }, [reload, loader]);

    return { data, loading, error, reload };
};
