import { StyleSheet } from 'react-native';

export const createStyles = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: 20,
        justifyContent: 'center',
        gap: 16,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    statusBlock: {
        backgroundColor: theme.colors.surface,
        borderRadius: 16,
        padding: 20,
        gap: 12,
        alignItems: 'center',
    },
    statusTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: theme.colors.textPrimary,
        textAlign: 'center',
    },
    statusSubtitle: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        textAlign: 'center',
    },
    driverCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: 16,
        padding: 16,
        gap: 12,
    },
    driverRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    driverInfo: {
        flex: 1,
    },
    driverName: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.textPrimary,
    },
    driverMeta: {
        fontSize: 14,
        color: theme.colors.textSecondary,
    },
    callButton: {
        flexDirection: 'row',
        backgroundColor: theme.colors.primary,
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    callButtonText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 15,
    },
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
    errorText: {
        color: '#EF4444',
        fontSize: 14,
        textAlign: 'center',
    },
    reassignBanner: {
        backgroundColor: '#FEF3C7',
        borderRadius: 12,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    reassignBannerText: {
        flex: 1,
        color: '#92400E',
        fontSize: 14,
        fontWeight: '600',
    },
});
