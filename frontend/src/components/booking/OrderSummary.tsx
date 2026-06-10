import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '../../constants/theme';
import type { OrderResponse } from '../../services/orderService';
import { createStyles } from './OrderSummary.style';

interface OrderSummaryProps {
    order: OrderResponse;
}

const OrderSummary = ({ order }: OrderSummaryProps) => {
    
    const { t } = useTranslation();
    const styles = createStyles(theme);

    const price = order.finalPrice ?? order.estimatedPrice;

    return (
        <View style={styles.card} testID="complete-summary">
            <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{t('booking-from')}</Text>
                <Text style={styles.summaryValue} numberOfLines={2}>
                    {order.pickupAddress}
                </Text>
            </View>
            <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{t('booking-to')}</Text>
                <Text style={styles.summaryValue} numberOfLines={2}>
                    {order.dropoffAddress}
                </Text>
            </View>
            {typeof order.distanceKm === 'number' && (
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>{t('booking-distance')}</Text>
                    <Text style={styles.summaryValue}>{order.distanceKm.toFixed(1)} km</Text>
                </View>
            )}
            {typeof price === 'number' && (
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>{t('booking-final-price')}</Text>
                    <Text style={styles.priceValue} testID="complete-price">
                        {price.toFixed(2)} EUR
                    </Text>
                </View>
            )}
        </View>
    );
};

export default OrderSummary;
