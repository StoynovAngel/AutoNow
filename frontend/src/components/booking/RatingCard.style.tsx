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
        rateTitle: {
            fontSize: 16,
            fontWeight: '700',
            color: theme.colors.textPrimary,
        },
        starsRow: {
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 8,
        },
        star: {
            padding: 4,
        },
        commentInput: {
            borderWidth: 1,
            borderColor: theme.colors.border ?? '#E5E7EB',
            borderRadius: 12,
            padding: 12,
            fontSize: 14,
            color: theme.colors.textPrimary,
            minHeight: 80,
            textAlignVertical: 'top',
        },
        errorText: {
            color: '#EF4444',
            fontSize: 13,
            textAlign: 'center',
        },
    });
