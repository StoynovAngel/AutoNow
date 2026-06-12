import { StyleSheet } from 'react-native';
import type { Theme } from '../../constants/theme';

export const createStyles = (theme: Theme) =>
    StyleSheet.create({
        routeInfo: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        routeMetric: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.colors.textPrimary,
        },
        routeError: {
            fontSize: 14,
            color: '#EF4444',
        },
    });
