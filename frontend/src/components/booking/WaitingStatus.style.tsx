import { StyleSheet } from 'react-native';
import type { Theme } from '../../hooks/useTheme';

export const createStyles = (theme: Theme) =>
    StyleSheet.create({
        statusBlock: {
            backgroundColor: theme.colors.surface,
            borderRadius: 16,
            padding: 20,
            gap: 12,
            alignItems: 'center',
        },
        statusTitle: {
            fontSize: 20,
            fontWeight: '700',
            color: theme.colors.textPrimary,
            textAlign: 'center',
        },
        statusSubtitle: {
            fontSize: 14,
            color: theme.colors.textSecondary,
            textAlign: 'center',
        },
        errorText: {
            color: '#EF4444',
            fontSize: 14,
            textAlign: 'center',
        },
    });
