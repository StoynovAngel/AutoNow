import { StyleSheet } from 'react-native';

export const createStyles = (theme: any) => StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        marginVertical: 36,
        backgroundColor: theme.colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        width: "80%",
        height: 60,
        borderRadius: 20,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 46,
    },
    image: {
        width: theme.components.header.imageSize,
        height: theme.components.header.imageSize,
        borderRadius: theme.components.header.imageSize / 2,
        marginRight: 10,
    },
    username: {
        fontSize: 16,
        fontFamily: 'Courier New',
        fontWeight: '800',
        color: theme.colors.textPrimary,
    },
    logoutButton: {
        backgroundColor: theme.colors.transparent,
        justifyContent: 'center',
        marginLeft: 8,
    },

    adminButton: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 8,
    },

    adminButtonText: {
        color: theme.colors.surface,
        fontSize: 14,
        fontWeight: '600',
    },
});