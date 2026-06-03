import { StyleSheet } from 'react-native';

export const createStyles = (theme: any) => StyleSheet.create({
    container: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.textSecondary,
        marginBottom: 4,
    },
    cards: {
        flexDirection: 'row',
        gap: 8,
    },
    card: {
        flex: 1,
        backgroundColor: theme.colors.surface,
        borderRadius: 16,
        padding: 12,
        borderWidth: 2,
        borderColor: theme.colors.border,
        gap: 4,
    },
    cardSelected: {
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.background,
    },
    cardDisabled: {
        opacity: 0.4,
    },
    cardLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.textPrimary,
    },
    cardHint: {
        fontSize: 11,
        color: theme.colors.textSecondary,
    },
    lockedHint: {
        fontSize: 12,
        color: theme.colors.textSecondary,
        fontStyle: 'italic',
    },
});
