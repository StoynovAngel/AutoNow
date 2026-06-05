import { StyleSheet } from 'react-native';

export const createStyles = (theme: any) => StyleSheet.create({
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.colors.border,
        paddingHorizontal: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: theme.colors.textPrimary,
        paddingVertical: 12,
    },
    spinner: {
        marginLeft: 8,
    },
    errorText: {
        marginTop: 6,
        fontSize: 12,
        color: '#EF4444',
    },
    suggestions: {
        marginTop: 8,
        backgroundColor: theme.colors.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.colors.border,
        overflow: 'hidden',
    },
    suggestion: {
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    suggestionText: {
        fontSize: 14,
        color: theme.colors.textPrimary,
    },
    selectedRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.colors.border,
        padding: 12,
        gap: 10,
    },
    selectedIcon: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#1F2937',
    },
    selectedText: {
        flex: 1,
        fontSize: 14,
        color: theme.colors.textPrimary,
    },
    clearButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: theme.colors.border,
        justifyContent: 'center',
        alignItems: 'center',
    },
    clearText: {
        fontSize: 18,
        color: theme.colors.textPrimary,
        marginTop: -2,
    },
});
