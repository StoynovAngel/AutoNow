import { useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

export const useAppForeground = (onForeground: () => void) => {
    const callbackRef = useRef(onForeground);
    callbackRef.current = onForeground;

    useEffect(() => {
        const previousState = { current: AppState.currentState as AppStateStatus };
        const subscription = AppState.addEventListener('change', (next) => {
            if (
                (previousState.current === 'background' || previousState.current === 'inactive') &&
                next === 'active'
            ) {
                callbackRef.current();
            }
            previousState.current = next;
        });
        return () => subscription.remove();
    }, []);
};
