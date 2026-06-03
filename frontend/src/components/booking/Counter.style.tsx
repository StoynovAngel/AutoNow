import { StyleSheet } from 'react-native';

export const createStyles = (theme: any) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: theme.colors.surface,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.textPrimary,
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    button: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    buttonDisabled: {
        opacity: 0.4,
    },
    value: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.colors.textPrimary,
        minWidth: 32,
        textAlign: 'center',
    },
    valueUnset: {
        color: theme.colors.textSecondary,
    },
});
