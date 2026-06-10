import { StyleSheet } from 'react-native';
import type { Theme } from '../../hooks/useTheme';

export const createStyles = (theme: Theme) =>
    StyleSheet.create({
        actionsRow: {
            flexDirection: 'row',
            gap: 12,
            marginTop: 8,
        },
        primaryButton: {
            flex: 1,
            backgroundColor: theme.colors.primary,
            borderRadius: 12,
            paddingVertical: 14,
            alignItems: 'center',
        },
        primaryButtonDisabled: {
            opacity: 0.4,
        },
        primaryButtonText: {
            color: '#FFFFFF',
            fontWeight: '700',
            fontSize: 15,
        },
        secondaryButton: {
            flex: 1,
            borderWidth: 1,
            borderColor: theme.colors.border ?? '#E5E7EB',
            borderRadius: 12,
            paddingVertical: 14,
            alignItems: 'center',
        },
        secondaryButtonText: {
            color: theme.colors.textPrimary,
            fontWeight: '700',
            fontSize: 15,
        },
    });
