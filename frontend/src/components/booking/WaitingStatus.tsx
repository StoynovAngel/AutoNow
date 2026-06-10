import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import type { OrderStatus } from '../../services/orderService';
import { createStyles } from './WaitingStatus.style';

interface WaitingStatusProps {
    status: OrderStatus | undefined;
    error: string | undefined;
}

const titleKeyFor = (status: OrderStatus | undefined): string => {
    if (status === 'ACCEPTED') return 'booking-waiting-accepted';
    if (status === 'IN_PROGRESS') return 'booking-waiting-in-progress';
    return 'booking-waiting-searching';
};

const subtitleKeyFor = (status: OrderStatus | undefined): string => {
    if (status === 'ACCEPTED') return 'booking-waiting-accepted-hint';
    if (status === 'IN_PROGRESS') return 'booking-waiting-in-progress-hint';
    return 'booking-waiting-searching-hint';
};

const WaitingStatus = ({ status, error }: WaitingStatusProps) => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const styles = createStyles(theme);

    return (
        <View style={styles.statusBlock}>
            {!status ? (
                <ActivityIndicator color={theme.colors.primary} testID="waiting-loading" />
            ) : (
                <>
                    <Text style={styles.statusTitle} testID="waiting-status-title">
                        {t(titleKeyFor(status))}
                    </Text>
                    <Text style={styles.statusSubtitle}>{t(subtitleKeyFor(status))}</Text>
                </>
            )}
            {error && (
                <Text
                    style={styles.errorText}
                    testID="waiting-error"
                    accessibilityRole="alert"
                    accessibilityLiveRegion="assertive"
                >
                    {t('booking-waiting-poll-failed')}
                </Text>
            )}
        </View>
    );
};

export default WaitingStatus;
