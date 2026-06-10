import { StyleSheet } from 'react-native';
import type { Theme } from '../../hooks/useTheme';

export const createStyles = (theme: Theme) =>
    StyleSheet.create({
        cancelButton: {
            borderWidth: 1,
            borderColor: '#EF4444',
            borderRadius: 12,
            paddingVertical: 12,
            alignItems: 'center',
            marginTop: 8,
        },
        cancelButtonText: {
            color: '#EF4444',
            fontWeight: '700',
            fontSize: 15,
        },
        simulateButton: {
            backgroundColor: theme.colors.primary,
            borderRadius: 12,
            paddingVertical: 14,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 8,
        },
        simulateButtonText: {
            color: '#FFFFFF',
            fontWeight: '700',
            fontSize: 15,
        },
    });
