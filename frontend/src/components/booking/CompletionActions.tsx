import React from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import { createStyles } from './CompletionActions.style';

interface CompletionActionsProps {
    hasDriver: boolean;
    canSubmit: boolean;
    submitting: boolean;
    onSkip: () => void;
    onSubmit: () => void;
}

const CompletionActions = ({
    hasDriver,
    canSubmit,
    submitting,
    onSkip,
    onSubmit,
}: CompletionActionsProps) => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const styles = createStyles(theme);

    return (
        <View style={styles.actionsRow}>
            <Pressable
                style={styles.secondaryButton}
                onPress={onSkip}
                testID="complete-skip"
                accessibilityRole="button"
            >
                <Text style={styles.secondaryButtonText}>
                    {hasDriver ? t('rating-skip') : t('booking-back-home')}
                </Text>
            </Pressable>
            {hasDriver && (
                <Pressable
                    style={[styles.primaryButton, !canSubmit && styles.primaryButtonDisabled]}
                    disabled={!canSubmit}
                    onPress={onSubmit}
                    testID="complete-submit"
                    accessibilityRole="button"
                >
                    {submitting ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={styles.primaryButtonText}>{t('rating-submit')}</Text>
                    )}
                </Pressable>
            )}
        </View>
    );
};

export default CompletionActions;
