import { StyleSheet } from 'react-native';
import type { Theme } from '../../constants/theme';

export const createStyles = (theme: Theme) =>
    StyleSheet.create({
        card: {
            backgroundColor: theme.colors.surface,
            borderRadius: 16,
            padding: 16,
            gap: 12,
        },
        summaryRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        summaryLabel: {
            fontSize: 13,
            color: theme.colors.textSecondary,
            textTransform: 'uppercase',
        },
        summaryValue: {
            fontSize: 15,
            fontWeight: '600',
            color: theme.colors.textPrimary,
            flexShrink: 1,
            textAlign: 'right',
            marginLeft: 12,
        },
        priceValue: {
            fontSize: 20,
            fontWeight: '700',
            color: theme.colors.primary,
        },
    });
