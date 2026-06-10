import { StyleSheet } from 'react-native';
import type { Theme } from '../../hooks/useTheme';

export const createStyles = (theme: Theme) =>
    StyleSheet.create({
        weightInputRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        weightInput: {
            flex: 1,
            borderWidth: 1,
            borderColor: theme.colors.border ?? '#E5E7EB',
            borderRadius: 12,
            paddingHorizontal: 12,
            paddingVertical: 10,
            fontSize: 15,
            color: theme.colors.textPrimary,
            backgroundColor: theme.colors.background,
        },
        weightInputError: {
            borderColor: '#EF4444',
        },
        weightError: {
            fontSize: 12,
            color: '#EF4444',
            marginTop: -4,
        },
        weightUnit: {
            fontSize: 14,
            color: theme.colors.textSecondary,
            minWidth: 24,
        },
    });
