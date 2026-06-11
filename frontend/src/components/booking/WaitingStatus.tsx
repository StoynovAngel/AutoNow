import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '../../constants/theme';
import type { OrderStatus } from '../../services/orderService';
import { createStyles } from './WaitingStatus.style';

interface WaitingStatusProps {
    status: OrderStatus | undefined;
    error: string | undefined;
}

const STATUS_KEYS: Partial<Record<OrderStatus, { title: string; subtitle: string }>> = {
    ACCEPTED:    { title: 'booking-waiting-accepted',    subtitle: 'booking-waiting-accepted-hint' },
    IN_PROGRESS: { title: 'booking-waiting-in-progress', subtitle: 'booking-waiting-in-progress-hint' },
};
const DEFAULT_KEYS = { title: 'booking-waiting-searching', subtitle: 'booking-waiting-searching-hint' };

const WaitingStatus = ({ status, error }: WaitingStatusProps) => {

    const { t } = useTranslation();
    const styles = createStyles(theme);
    const keys = (status && STATUS_KEYS[status]) ?? DEFAULT_KEYS;

    return (
        <View style={styles.statusBlock}>
            {!status ? (
                <ActivityIndicator color={theme.colors.primary} testID="waiting-loading" />
            ) : (
                <>
                    <Text style={styles.statusTitle} testID="waiting-status-title">
                        {t(keys.title)}
                    </Text>
                    <Text style={styles.statusSubtitle}>{t(keys.subtitle)}</Text>
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
