import type { ReactElement } from 'react';
import { render } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '../hooks/useTheme';

const initialMetrics = {
    frame: { x: 0, y: 0, width: 0, height: 0 },
    insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

export const renderWithProviders = (ui: ReactElement) =>
    render(
        <SafeAreaProvider initialMetrics={initialMetrics}>
            <ThemeProvider>{ui}</ThemeProvider>
        </SafeAreaProvider>,
    );
