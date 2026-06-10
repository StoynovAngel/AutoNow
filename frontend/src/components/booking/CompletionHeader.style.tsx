import { StyleSheet } from 'react-native';
import type { Theme } from '../../hooks/useTheme';

export const createStyles = (theme: Theme) =>
    StyleSheet.create({
        header: {
            alignItems: 'center',
            gap: 8,
        },
        title: {
            fontSize: 22,
            fontWeight: '700',
            color: theme.colors.textPrimary,
            textAlign: 'center',
        },
        subtitle: {
            fontSize: 14,
            color: theme.colors.textSecondary,
            textAlign: 'center',
        },
    });
