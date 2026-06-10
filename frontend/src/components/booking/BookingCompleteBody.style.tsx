import { StyleSheet } from 'react-native';
import type { Theme } from '../../hooks/useTheme';

export const createStyles = (theme: Theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        scrollContent: {
            padding: 20,
            paddingTop: 56,
            gap: 16,
        },
        errorText: {
            color: '#EF4444',
            fontSize: 13,
            textAlign: 'center',
        },
    });
