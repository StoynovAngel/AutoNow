import { StyleSheet } from 'react-native';
import type { Theme } from '../../hooks/useTheme';

export const createStyles = (theme: Theme) =>
    StyleSheet.create({
        mapContainer: {
            flex: 1,
            position: 'relative',
        },
        backFab: {
            position: 'absolute',
            top: 48,
            left: 16,
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: theme.colors.surface,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 3,
        },
    });
