import { StyleSheet } from 'react-native';
import type { Theme } from '../../constants/theme';

export const createStyles = (theme: Theme) =>
    StyleSheet.create({
        row: {
            flexDirection: 'row',
            gap: 8,
        },
        input: {
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
        inputError: {
            borderColor: '#EF4444',
        },
        error: {
            fontSize: 12,
            color: '#EF4444',
            marginTop: -4,
        },
    });
