import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { theme } from '../../constants/theme';
import type { RootStackParamList } from '../../navigation/Navigation';
import {
    cancelOrder,
    updateOrderStatus,
    type OrderResponse,
} from '../../services/orderService';
import { useOrderPolling } from '../../hooks/useOrderPolling';
import WaitingStatus from './WaitingStatus';
import ReassignBanner from './ReassignBanner';
import DriverCard from './DriverCard';
import WaitingActions from './WaitingActions';
import { createStyles } from './BookingWaitingBody.style';

type BookingWaitingRouteProp = RouteProp<RootStackParamList, 'bookingWaiting'>;

const BookingWaitingBody = () => {

    const { t } = useTranslation();
    const styles = createStyles(theme);

    const route = useRoute<BookingWaitingRouteProp>();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { orderId } = route.params;

    const [cancelling, setCancelling] = useState(false);
    const [simulating, setSimulating] = useState(false);

    const handleTerminal = (terminalOrder: OrderResponse) => {
        if (terminalOrder.status === 'COMPLETED') {
            navigation.replace('bookingComplete', { orderId });
        } else if (terminalOrder.status === 'CANCELED') {
            navigation.reset({ index: 0, routes: [{ name: 'home' }] });
        }
    };

    const { order, error, reassigned, setOrder, stop } = useOrderPolling(orderId, handleTerminal);

    const handleCancel = async () => {
        if (!order || cancelling) return;
        setCancelling(true);
        try {
            const updated = await cancelOrder(order.id);
            setOrder(updated);
            handleTerminal(updated);
        } catch (e) {
            const msg = e instanceof Error ? e.message : t('booking-cancel-failed');
            Alert.alert(t('booking-cancel-failed'), msg);
        } finally {
            setCancelling(false);
        }
    };

    const handleSimulate = async () => {
        if (!order || simulating) return;
        setSimulating(true);
        try {
            const updated = await updateOrderStatus(order.id, 'COMPLETED');
            stop();
            setOrder(updated);
            navigation.replace('bookingComplete', { orderId: order.id });
        } catch (e) {
            const msg = e instanceof Error ? e.message : t('booking-simulate-failed');
            Alert.alert(t('booking-simulate-failed'), msg);
            setSimulating(false);
        }
    };

    const status = order?.status;
    const canCancel = order != null && (status === 'CREATED' || status === 'ACCEPTED') && !cancelling;
    const showDriver = status === 'ACCEPTED' || status === 'IN_PROGRESS';
    const canSimulate = showDriver && !simulating && !cancelling;

    return (
        <View style={styles.container} testID="booking-waiting">
            <WaitingStatus status={status} error={error} />

            {reassigned && <ReassignBanner />}

            {showDriver && order?.driver && (
                <DriverCard driver={order.driver} vehicle={order.vehicle} />
            )}

            <WaitingActions
                canCancel={canCancel}
                cancelling={cancelling}
                onCancel={handleCancel}
                canSimulate={canSimulate}
                simulating={simulating}
                onSimulate={handleSimulate}
            />
        </View>
    );
};

export default BookingWaitingBody;
