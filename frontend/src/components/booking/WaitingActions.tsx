import React from 'react';
import { Pressable, Text, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '../../constants/theme';
import { createStyles } from './WaitingActions.style';

interface WaitingActionsProps {
    canCancel: boolean;
    cancelling: boolean;
    onCancel: () => void;
    canSimulate: boolean;
    simulating: boolean;
    onSimulate: () => void;
}

const WaitingActions = ({
    canCancel,
    cancelling,
    onCancel,
    canSimulate,
    simulating,
    onSimulate,
}: WaitingActionsProps) => {

    const { t } = useTranslation();
    const styles = createStyles(theme);

    return (
        <>
            {canCancel && (
                <Pressable
                    style={styles.cancelButton}
                    onPress={onCancel}
                    disabled={cancelling}
                    testID="waiting-cancel"
                    accessibilityRole="button"
                >
                    {cancelling ? (
                        <ActivityIndicator color="#EF4444" />
                    ) : (
                        <Text style={styles.cancelButtonText}>{t('booking-cancel')}</Text>
                    )}
                </Pressable>
            )}
            {canSimulate && (
                <Pressable
                    style={styles.simulateButton}
                    onPress={onSimulate}
                    disabled={simulating}
                    testID="waiting-simulate"
                    accessibilityRole="button"
                >
                    {simulating ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={styles.simulateButtonText}>{t('booking-simulate')}</Text>
                    )}
                </Pressable>
            )}
        </>
    );
};

export default WaitingActions;
