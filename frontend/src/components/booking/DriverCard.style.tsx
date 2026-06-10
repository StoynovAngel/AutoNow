import { StyleSheet } from 'react-native';
import type { Theme } from '../../hooks/useTheme';

export const createStyles = (theme: Theme) =>
    StyleSheet.create({
        driverCard: {
            backgroundColor: theme.colors.surface,
            borderRadius: 16,
            padding: 16,
            gap: 12,
        },
        driverRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
        },
        driverInfo: {
            flex: 1,
        },
        driverName: {
            fontSize: 16,
            fontWeight: '700',
            color: theme.colors.textPrimary,
        },
        driverMeta: {
            fontSize: 14,
            color: theme.colors.textSecondary,
        },
        callButton: {
            flexDirection: 'row',
            backgroundColor: theme.colors.primary,
            borderRadius: 12,
            paddingVertical: 12,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
        },
        callButtonText: {
            color: '#FFFFFF',
            fontWeight: '700',
            fontSize: 15,
        },
    });
