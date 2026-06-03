import { StyleSheet } from 'react-native';

export const createStyles = (theme: any) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: theme.colors.surface,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.textPrimary,
        flex: 1,
    },
});
