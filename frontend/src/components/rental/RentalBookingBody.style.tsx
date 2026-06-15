import { StyleSheet } from 'react-native';

export const createStyles = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        backgroundColor: theme.colors.surface,
        paddingTop: 48,
        paddingBottom: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.textPrimary,
        marginBottom: 4,
    },
    vehicleLabel: {
        fontSize: 14,
        color: theme.colors.textSecondary,
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
        gap: 20,
    },
    vehicleCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: theme.colors.border,
        overflow: 'hidden',
    },
    vehicleImage: {
        width: '100%',
        height: 480,
    },
    vehicleImagePlaceholder: {
        width: '100%',
        height: 180,
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    vehicleInfo: {
        padding: 16,
    },
    vehicleName: {
        fontSize: 20,
        fontWeight: '700',
        color: theme.colors.textPrimary,
    },
    vehiclePlate: {
        fontSize: 13,
        color: theme.colors.textSecondary,
        marginTop: 4,
    },
    dateSection: {
        gap: 12,
        marginVertical: 30
    },
    dateLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.textPrimary,
        marginBottom: 4,
    },
    dateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.colors.border,
        paddingHorizontal: 16,
        paddingVertical: 14,
        gap: 12,
    },
    dateButtonText: {
        fontSize: 15,
        color: theme.colors.textPrimary,
        flex: 1,
    },
    dateButtonPlaceholder: {
        color: theme.colors.textSecondary,
    },
    errorText: {
        fontSize: 13,
        color: '#EF4444',
        marginTop: 4,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    priceLabel: {
        fontSize: 15,
        color: theme.colors.textSecondary,
    },
    priceValue: {
        fontSize: 20,
        fontWeight: '700',
        color: theme.colors.primary,
    },
    confirmButton: {
        backgroundColor: theme.colors.primary,
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 8,
    },
    confirmButtonDisabled: {
        opacity: 0.5,
    },
    confirmButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    errorAlert: {
        backgroundColor: '#FEE2E2',
        borderRadius: 10,
        padding: 12,
        borderWidth: 1,
        borderColor: '#FECACA',
    },
    errorAlertText: {
        fontSize: 14,
        color: '#DC2626',
    },
});
