import {StyleSheet} from "react-native";

export const createStyles = (theme: any) => StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    container: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'flex-end',
    },
    loginContainer: {
        width: '100%',
        backgroundColor: theme.colors.surface + "70",
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingHorizontal: 28,
        paddingTop: 40,
        paddingBottom: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 8,
    },
    highlight: {
        color: theme.colors.primary,
    },
    subtitle: {
        fontSize: 15,
        color: theme.colors.secondary,
        marginBottom: 32,
    },
    inputContainer: {
        gap: 16,
        marginBottom: 24,
    },
    input: {
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
    },
    errorText: {
        color: '#EF4444',
        fontSize: 13,
        marginTop: -12,
        marginLeft: 4,
        fontWeight: '500',
    },
    loginButton: {
        borderRadius: 16,
        backgroundColor: theme.colors.primary,
        paddingVertical: 8,
        marginBottom: 12,
    },
    registerLinkContainer: {
        paddingVertical: 12,
        alignItems: 'center',
    },
    registerLinkText: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
    },
    registerLinkHighlight: {
        color: theme.colors.primary,
        fontWeight: '700',
        textDecorationLine: 'underline',
    },
});