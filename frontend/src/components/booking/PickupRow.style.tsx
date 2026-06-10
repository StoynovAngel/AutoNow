import { StyleSheet } from 'react-native';
import type { Theme } from '../../constants/theme';

export const createStyles = (theme: Theme) =>
    StyleSheet.create({
        ambulanceOrigin: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            backgroundColor: theme.colors.background,
            borderRadius: 10,
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderWidth: 1,
            borderColor: theme.colors.primary,
        },
        ambulanceOriginText: {
            flex: 1,
            fontSize: 14,
            color: theme.colors.textPrimary,
        },
        pickupFixed: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            borderWidth: 1,
            borderColor: theme.colors.border ?? '#E5E7EB',
            borderRadius: 12,
            paddingHorizontal: 12,
            paddingVertical: 10,
            backgroundColor: theme.colors.background,
        },
        pickupFixedText: {
            flex: 1,
            fontSize: 15,
            color: theme.colors.textSecondary,
        },
        errorText: {
            fontSize: 14,
            color: '#EF4444',
        },
    });
