import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '../../constants/theme';
import type { OrderEstimateResponse } from '../../services/orderService';
import type { RouteResult } from '../../services/mapboxService';
import { createStyles } from './RouteSummary.style';

interface RouteSummaryProps {
    routeLoading: boolean;
    routeResult: RouteResult | undefined;
    estimate: OrderEstimateResponse | undefined;
    estimateLoading: boolean;
    isAmbulance: boolean;
    pickupReady: boolean;
}

const RouteSummary = ({
    routeLoading,
    routeResult,
    estimate,
    estimateLoading,
    isAmbulance,
    pickupReady,
}: RouteSummaryProps) => {

    const { t } = useTranslation();
    const styles = createStyles(theme);

    return (
        <View style={styles.routeInfo} testID="route-info">
            {routeLoading ? (
                <ActivityIndicator color={theme.colors.primary} />
            ) : routeResult ? (
                <>
                    <Text style={styles.routeMetric} testID="route-distance">
                        {routeResult.distanceKm.toFixed(1)} km
                    </Text>
                    {estimateLoading ? (
                        <ActivityIndicator color={theme.colors.primary} testID="estimate-loading" />
                    ) : estimate ? (
                        <Text style={styles.routeMetric} testID="estimate-price">
                            {isAmbulance ? `${t('booking-ambulance-estimated-price')}: ` : ''}
                            {estimate.estimatedPrice.toFixed(2)} {estimate.currency}
                        </Text>
                    ) : (
                        <Text style={styles.routeError} testID="estimate-error">
                            {t('booking-estimate-failed')}
                        </Text>
                    )}
                </>
            ) : isAmbulance && !pickupReady ? (
                <ActivityIndicator color={theme.colors.primary} />
            ) : (
                <Text style={styles.routeError}>{t('booking-no-route')}</Text>
            )}
        </View>
    );
};

export default RouteSummary;
