import { StyleSheet } from 'react-native';
import type { lightTheme } from '../../constants/theme';

type Theme = typeof lightTheme;

export const createStyles = (theme: Theme) => StyleSheet.create({
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

    container: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.background,
        paddingTop: 36,
        paddingBottom: 12,
    },
});