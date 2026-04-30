import { StyleSheet } from 'react-native';
import { theme } from '../../constants/theme';

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: theme.colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        width: "100%",
        height: 60,
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
        fontWeight: '500',
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

export default styles;