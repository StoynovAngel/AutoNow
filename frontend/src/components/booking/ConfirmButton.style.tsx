import { StyleSheet } from 'react-native';
import type { Theme } from '../../hooks/useTheme';

export const createStyles = (theme: Theme) =>
    StyleSheet.create({
        confirmButton: {
            backgroundColor: theme.colors.primary,
            borderRadius: 16,
            paddingVertical: 14,
            alignItems: 'center',
            marginTop: 4,
        },
        confirmButtonDisabled: {
            opacity: 0.4,
        },
        confirmText: {
            fontSize: 16,
            fontWeight: '700',
            color: '#FFFFFF',
        },
    });
