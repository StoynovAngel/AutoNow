import { StyleSheet } from 'react-native';

export const createStyles = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: 20,
        paddingTop: 56,
        gap: 16,
    },
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
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: 16,
        padding: 16,
        gap: 12,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    summaryLabel: {
        fontSize: 13,
        color: theme.colors.textSecondary,
        textTransform: 'uppercase',
    },
    summaryValue: {
        fontSize: 15,
        fontWeight: '600',
        color: theme.colors.textPrimary,
        flexShrink: 1,
        textAlign: 'right',
        marginLeft: 12,
    },
    priceValue: {
        fontSize: 20,
        fontWeight: '700',
        color: theme.colors.primary,
    },
    rateTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.textPrimary,
    },
    starsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    star: {
        padding: 4,
    },
    commentInput: {
        borderWidth: 1,
        borderColor: theme.colors.border ?? '#E5E7EB',
        borderRadius: 12,
        padding: 12,
        fontSize: 14,
        color: theme.colors.textPrimary,
        minHeight: 80,
        textAlignVertical: 'top',
    },
    actionsRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    primaryButton: {
        flex: 1,
        backgroundColor: theme.colors.primary,
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
    },
    primaryButtonDisabled: {
        opacity: 0.4,
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 15,
    },
    secondaryButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: theme.colors.border ?? '#E5E7EB',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: theme.colors.textPrimary,
        fontWeight: '700',
        fontSize: 15,
    },
    errorText: {
        color: '#EF4444',
        fontSize: 13,
        textAlign: 'center',
    },
});
