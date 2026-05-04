import { StyleSheet } from 'react-native';

export const createStyles = (theme: any) => StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
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

    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'transparent',
        zIndex: 10,
        paddingTop: 36,
    },
});