import { useEffect } from 'react';
import { AppState } from 'react-native';

export function useAppForeground(onForeground: () => void) {
    useEffect(() => {
        let wasBackground = false;
        const subscription = AppState.addEventListener('change', (state) => {
            if (state === 'background' || state === 'inactive') {
                wasBackground = true;
            } else if (state === 'active' && wasBackground) {
                wasBackground = false;
                onForeground();
            }
        });
        return () => subscription.remove();
    }, [onForeground]);
}
