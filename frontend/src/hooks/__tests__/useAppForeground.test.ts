import { act, renderHook } from '@testing-library/react-native';
import { AppState } from 'react-native';
import { useAppForeground } from './useAppForeground';

describe('useAppForeground', () => {
    type Listener = (state: 'active' | 'background' | 'inactive') => void;
    let listeners: Listener[] = [];
    const remove = jest.fn();

    beforeEach(() => {
        listeners = [];
        remove.mockClear();
        jest.spyOn(AppState, 'addEventListener').mockImplementation((event, cb) => {
            if (event === 'change') listeners.push(cb as Listener);
            return { remove } as { remove: () => void };
        });
        Object.defineProperty(AppState, 'currentState', {
            value: 'active',
            writable: true,
            configurable: true,
        });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('fires when state goes background -> active', () => {
        const cb = jest.fn();
        renderHook(() => useAppForeground(cb));

        act(() => listeners.forEach((l) => l('background')));
        act(() => listeners.forEach((l) => l('active')));

        expect(cb).toHaveBeenCalledTimes(1);
    });

    it('fires when state goes inactive -> active', () => {
        const cb = jest.fn();
        renderHook(() => useAppForeground(cb));

        act(() => listeners.forEach((l) => l('inactive')));
        act(() => listeners.forEach((l) => l('active')));

        expect(cb).toHaveBeenCalledTimes(1);
    });

    it('does not fire on initial active state', () => {
        const cb = jest.fn();
        renderHook(() => useAppForeground(cb));

        act(() => listeners.forEach((l) => l('active')));

        expect(cb).not.toHaveBeenCalled();
    });

    it('removes the listener on unmount', () => {
        const { unmount } = renderHook(() => useAppForeground(jest.fn()));
        unmount();
        expect(remove).toHaveBeenCalled();
    });
});
