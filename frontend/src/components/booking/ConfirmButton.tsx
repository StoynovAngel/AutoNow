import React from 'react';
import { Pressable, Text, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '../../constants/theme';
import { createStyles } from './ConfirmButton.style';

interface ConfirmButtonProps {
    enabled: boolean;
    submitting: boolean;
    onPress: () => void;
}

const ConfirmButton = ({ enabled, submitting, onPress }: ConfirmButtonProps) => {

    const { t } = useTranslation();
    const styles = createStyles(theme);

    return (
        <Pressable
            style={[styles.confirmButton, !enabled && styles.confirmButtonDisabled]}
            disabled={!enabled}
            onPress={onPress}
            testID="booking-confirm"
            accessibilityRole="button"
        >
            {submitting ? (
                <ActivityIndicator color="#FFFFFF" />
            ) : (
                <Text style={styles.confirmText}>{t('booking-confirm')}</Text>
            )}
        </Pressable>
    );
};

export default ConfirmButton;
