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
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    skipButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    skipText: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.primary,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.textPrimary,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: theme.colors.textSecondary,
    },
    content: {
        flex: 1,
    },
    contentInner: {
        padding: 16,
        gap: 12,
    },
    footer: {
        padding: 16,
        backgroundColor: theme.colors.surface,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
    },
    continueButton: {
        backgroundColor: theme.colors.primary,
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: 'center',
    },
    continueText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
});
