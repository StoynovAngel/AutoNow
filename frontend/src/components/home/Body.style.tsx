import {StyleSheet} from "react-native";

export const createStyles = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    contentContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    content: {
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: theme.colors.textPrimary,
        marginBottom: 8,
        textAlign: "center"
    },
    subtitle: {
        fontSize: 16,
        color: theme.colors.textSecondary,
        marginBottom: 24,
        borderBottomColor: theme.colors.textPrimary,
        borderBottomWidth: 2,
        paddingBottom: 4,
        textAlign: "center"
    },
    vehicleGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        justifyContent: 'center',
        alignItems: 'flex-start',
        alignSelf: 'center',
        width: '100%',
    },
    vehicleCard: {
        width: '44%',
        backgroundColor: theme.colors.surface,
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        borderWidth: 2,
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    vehicleLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.colors.textPrimary,
        marginBottom: 4,
    },
    vehicleDescription: {
        fontSize: 12,
        color: theme.colors.textSecondary,
        textAlign: 'center',
    },
});
