import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, Linking, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import { AuthContext } from '../../services/AuthContext';
import type { RootStackParamList } from '../../navigation/Navigation';
import {
    cancelOrder,
    getOrderById,
    type OrderResponse,
    type OrderStatus,
} from '../../services/orderService';
import { createStyles } from './BookingWaitingBody.style';

type BookingWaitingRouteProp = RouteProp<RootStackParamList, 'bookingWaiting'>;

const POLL_INTERVAL_MS = 5000;
const REASSIGN_BANNER_MS = 6000;

const BookingWaitingBody = () => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const styles = createStyles(theme);

    const route = useRoute<BookingWaitingRouteProp>();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { orderId } = route.params;
    const auth = useContext(AuthContext);

    const [order, setOrder] = useState<OrderResponse | undefined>();
    const [error, setError] = useState<string | undefined>();
    const [cancelling, setCancelling] = useState(false);
    const [reassigned, setReassigned] = useState(false);

    const cancelledRef = useRef(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const reassignTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const previousDriverIdRef = useRef<number | undefined>(undefined);
    const navigationRef = useRef(navigation);
    navigationRef.current = navigation;

    const handleTerminal = useCallback(
        (status: OrderStatus) => {
            if (status === 'COMPLETED') {
                navigationRef.current.replace('bookingComplete', { orderId });
            } else if (status === 'CANCELED') {
                navigationRef.current.reset({ index: 0, routes: [{ name: 'home' }] });
            }
        },
        [orderId],
    );

    const poll = useCallback(async () => {
        if (cancelledRef.current) return;
        try {
            const next = await getOrderById(orderId);
            if (cancelledRef.current) return;
            const previousDriverId = previousDriverIdRef.current;
            const nextDriverId = next.driver?.id;
            if (
                previousDriverId != null &&
                nextDriverId != null &&
                previousDriverId !== nextDriverId
            ) {
                setReassigned(true);
                if (reassignTimerRef.current) clearTimeout(reassignTimerRef.current);
                reassignTimerRef.current = setTimeout(() => {
                    if (!cancelledRef.current) setReassigned(false);
                }, REASSIGN_BANNER_MS);
            }
            previousDriverIdRef.current = nextDriverId;
            setOrder(next);
            setError(undefined);
            if (next.status === 'COMPLETED' || next.status === 'CANCELED') {
                handleTerminal(next.status);
                return;
            }
        } catch (e) {
            if (cancelledRef.current) return;
            const msg = e instanceof Error ? e.message : 'error';
            setError(msg);
        }
        if (cancelledRef.current) return;
        timerRef.current = setTimeout(poll, POLL_INTERVAL_MS);
    }, [orderId, handleTerminal]);

    useEffect(() => {
        cancelledRef.current = false;
        poll();
        return () => {
            cancelledRef.current = true;
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
            if (reassignTimerRef.current) {
                clearTimeout(reassignTimerRef.current);
                reassignTimerRef.current = null;
            }
        };
    }, [poll]);

    const handleCall = async () => {
        const phone = order?.driver?.phoneNumber;
        if (!phone) return;
        try {
            await Linking.openURL(`tel:${phone}`);
        } catch {
            // ignore
        }
    };

    const handleCancel = async () => {
        if (!order || cancelling) return;
        setCancelling(true);
        try {
            const updated = await cancelOrder(order.id);
            setOrder(updated);
            handleTerminal(updated.status);
        } catch (e) {
            const msg = e instanceof Error ? e.message : t('booking-cancel-failed');
            Alert.alert(t('booking-cancel-failed'), msg);
        } finally {
            setCancelling(false);
        }
    };

    void auth;

    const status = order?.status;
    const canCancel =
        order != null && (status === 'CREATED' || status === 'ACCEPTED') && !cancelling;
    const showDriver = status === 'ACCEPTED' || status === 'IN_PROGRESS';

    const titleKey =
        status === 'ACCEPTED'
            ? 'booking-waiting-accepted'
            : status === 'IN_PROGRESS'
                ? 'booking-waiting-in-progress'
                : 'booking-waiting-searching';

    const subtitleKey =
        status === 'ACCEPTED'
            ? 'booking-waiting-accepted-hint'
            : status === 'IN_PROGRESS'
                ? 'booking-waiting-in-progress-hint'
                : 'booking-waiting-searching-hint';

    return (
        <View style={styles.container} testID="booking-waiting">
            <View style={styles.statusBlock}>
                {!order ? (
                    <ActivityIndicator color={theme.colors.primary} testID="waiting-loading" />
                ) : (
                    <>
                        <Text style={styles.statusTitle} testID="waiting-status-title">
                            {t(titleKey)}
                        </Text>
                        <Text style={styles.statusSubtitle}>{t(subtitleKey)}</Text>
                    </>
                )}
                {error && (
                    <Text style={styles.errorText} testID="waiting-error">
                        {t('booking-waiting-poll-failed')}
                    </Text>
                )}
            </View>

            {reassigned && (
                <View style={styles.reassignBanner} testID="waiting-reassigned">
                    <MaterialIcons name="info" size={20} color="#92400E" />
                    <Text style={styles.reassignBannerText}>
                        {t('booking-waiting-reassigned')}
                    </Text>
                </View>
            )}

            {showDriver && order?.driver && (
                <View style={styles.driverCard} testID="waiting-driver">
                    <View style={styles.driverRow}>
                        <MaterialIcons
                            name="person"
                            size={28}
                            color={theme.colors.textPrimary}
                        />
                        <View style={styles.driverInfo}>
                            <Text style={styles.driverName}>
                                {order.driver.firstName} {order.driver.lastName}
                            </Text>
                            {order.vehicle && (
                                <Text style={styles.driverMeta} testID="waiting-vehicle">
                                    {order.vehicle.brand} {order.vehicle.model} ·{' '}
                                    {order.vehicle.licensePlate}
                                </Text>
                            )}
                        </View>
                    </View>
                    <Pressable
                        style={styles.callButton}
                        onPress={handleCall}
                        testID="waiting-call"
                    >
                        <MaterialIcons name="phone" size={18} color="#FFFFFF" />
                        <Text style={styles.callButtonText}>
                            {order.driver.phoneNumber}
                        </Text>
                    </Pressable>
                </View>
            )}

            {canCancel && (
                <Pressable
                    style={styles.cancelButton}
                    onPress={handleCancel}
                    disabled={cancelling}
                    testID="waiting-cancel"
                >
                    {cancelling ? (
                        <ActivityIndicator color="#EF4444" />
                    ) : (
                        <Text style={styles.cancelButtonText}>{t('booking-cancel')}</Text>
                    )}
                </Pressable>
            )}
        </View>
    );
};

export default BookingWaitingBody;
