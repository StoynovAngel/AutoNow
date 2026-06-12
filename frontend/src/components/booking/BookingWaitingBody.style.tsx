import { StyleSheet } from 'react-native';
import type { Theme } from '../../constants/theme';

export const createStyles = (theme: Theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
            padding: 20,
            justifyContent: 'center',
            gap: 16,
        },
    });
