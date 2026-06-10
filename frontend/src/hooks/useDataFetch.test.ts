import { renderHook, waitFor, act } from '@testing-library/react-native';
import { useDataFetch } from './useDataFetch';

describe('useDataFetch', () => {
    it('runs the loader on mount and exposes data', async () => {
        const loader = jest.fn().mockResolvedValue([1, 2, 3]);
        const { result } = renderHook(() => useDataFetch<number[]>(loader, []));

        expect(result.current.loading).toBe(true);
        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(loader).toHaveBeenCalledTimes(1);
        expect(result.current.data).toEqual([1, 2, 3]);
        expect(result.current.error).toBe('');
    });

    it('reruns the loader when it changes', async () => {
        const first = jest.fn().mockResolvedValue(['a']);
        const second = jest.fn().mockResolvedValue(['b']);

        const { result, rerender } = renderHook(
            ({ loader }: { loader: () => Promise<string[]> }) => useDataFetch<string[]>(loader, []),
            { initialProps: { loader: first } },
        );

        await waitFor(() => expect(result.current.data).toEqual(['a']));

        rerender({ loader: second });

        await waitFor(() => expect(result.current.data).toEqual(['b']));
        expect(second).toHaveBeenCalledTimes(1);
    });

    it('parses errors from the loader', async () => {
        const loader = jest.fn().mockRejectedValue({ message: 'boom' });
        const { result } = renderHook(() => useDataFetch<string[]>(loader, []));

        await waitFor(() => expect(result.current.loading).toBe(false));
        expect(result.current.error).toBe('boom');
        expect(result.current.data).toEqual([]);
    });

    it('reload refetches and clears the error', async () => {
        const loader = jest
            .fn()
            .mockRejectedValueOnce({ message: 'boom' })
            .mockResolvedValueOnce(['ok']);

        const { result } = renderHook(() => useDataFetch<string[]>(loader, []));
        await waitFor(() => expect(result.current.error).toBe('boom'));

        await act(async () => {
            await result.current.reload();
        });

        expect(result.current.error).toBe('');
        expect(result.current.data).toEqual(['ok']);
    });

    it('ignores stale responses when a newer request supersedes them', async () => {
        let resolveFirst: (value: string[]) => void = () => {};
        const firstPromise = new Promise<string[]>((resolve) => {
            resolveFirst = resolve;
        });
        const loader = jest
            .fn<Promise<string[]>, []>()
            .mockReturnValueOnce(firstPromise)
            .mockResolvedValueOnce(['fresh']);

        const { result } = renderHook(() => useDataFetch<string[]>(loader, []));

        await act(async () => {
            await result.current.reload();
        });

        await act(async () => {
            resolveFirst(['stale']);
            await firstPromise;
        });

        expect(result.current.data).toEqual(['fresh']);
    });
});
