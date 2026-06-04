import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Pressable, Alert, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import { AuthContext } from '../../services/AuthContext';
import type { RootStackParamList } from '../../navigation/Navigation';
import { getRoute } from '../../services/mapboxService';
import type {
    AddressSuggestion,
    Coordinate,
    RouteResult,
} from '../../services/mapboxService';
import { createOrder, estimateOrder } from '../../services/orderService';
import type { OrderEstimateResponse } from '../../services/orderService';
import MapPreview from './MapPreview';
import AddressSearch from './AddressSearch';
import { createStyles } from './BookingMapBody.style';

type BookingMapRouteProp = RouteProp<RootStackParamList, 'bookingMap'>;

const SOFIA_CENTER: Coordinate = { latitude: 42.6977, longitude: 23.3219 };

const BookingMapBody = () => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const styles = createStyles(theme);

    const route = useRoute<BookingMapRouteProp>();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { companyId, vehicleType, preferences } = route.params;

    const auth = useContext(AuthContext);

    const [pickup, setPickup] = useState<AddressSuggestion | undefined>();
    const [destination, setDestination] = useState<AddressSuggestion | undefined>();
    const [routeResult, setRouteResult] = useState<RouteResult | undefined>();
    const [routeLoading, setRouteLoading] = useState(false);
    const [estimate, setEstimate] = useState<OrderEstimateResponse | undefined>();
    const [estimateLoading, setEstimateLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!pickup || !destination) {
            setRouteResult(undefined);
            return;
        }
        let cancelled = false;
        setRouteLoading(true);
        getRoute(pickup.coordinate, destination.coordinate)
            .then((r) => {
                if (!cancelled) setRouteResult(r);
            })
            .catch(() => {
                if (!cancelled) setRouteResult(undefined);
            })
            .finally(() => {
                if (!cancelled) setRouteLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [pickup, destination]);

    useEffect(() => {
        if (!routeResult) {
            setEstimate(undefined);
            return;
        }
        let cancelled = false;
        setEstimateLoading(true);
        estimateOrder({
            vehicleType,
            distanceKm: routeResult.distanceKm,
            vehicleClass: preferences.vehicleClass,
        })
            .then((e) => {
                if (!cancelled) setEstimate(e);
            })
            .catch(() => {
                if (!cancelled) setEstimate(undefined);
            })
            .finally(() => {
                if (!cancelled) setEstimateLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [routeResult, vehicleType, preferences.vehicleClass]);

    const handleConfirm = async () => {
        if (!pickup || !destination || !routeResult) return;
        if (!auth?.user) {
            Alert.alert(t('booking-must-login'));
            return;
        }
        setSubmitting(true);
        try {
            const created = await createOrder({
                userId: auth.user.id,
                vehicleType,
                pickupAddress: pickup.placeName,
                pickupLatitude: pickup.coordinate.latitude,
                pickupLongitude: pickup.coordinate.longitude,
                dropoffAddress: destination.placeName,
                dropoffLatitude: destination.coordinate.latitude,
                dropoffLongitude: destination.coordinate.longitude,
                distanceKm: routeResult.distanceKm,
                passengerCount: preferences.passengerCount,
                luggageCount: preferences.luggageCount,
                vehicleClass: preferences.vehicleClass,
                requiresAirConditioning: preferences.requiresAirConditioning,
            });
            navigation.replace('bookingWaiting', { orderId: created.id });
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Booking failed';
            Alert.alert(t('booking-failed'), msg);
        } finally {
            setSubmitting(false);
        }
    };

    const canConfirm = Boolean(pickup && destination && routeResult && !submitting);
    void companyId;

    const proximity = pickup?.coordinate ?? SOFIA_CENTER;

    return (
        <View style={styles.container}>
            <View style={styles.mapContainer}>
                <MapPreview
                    pickup={pickup?.coordinate}
                    destination={destination?.coordinate}
                    route={routeResult}
                />
                <Pressable
                    style={styles.backFab}
                    onPress={() => navigation.goBack()}
                    testID="map-back"
                >
                    <MaterialIcons name="arrow-back" size={24} color={theme.colors.textPrimary} />
                </Pressable>
            </View>

            <View style={styles.sheet}>
                <Text style={styles.title}>{t('booking-map-title')}</Text>

                <AddressSearch
                    proximity={proximity}
                    selected={pickup}
                    onSelect={setPickup}
                    onClear={() => setPickup(undefined)}
                    placeholder={t('booking-pickup-placeholder')}
                    testID="pickup-search"
                />

                <AddressSearch
                    proximity={proximity}
                    selected={destination}
                    onSelect={setDestination}
                    onClear={() => setDestination(undefined)}
                    placeholder={t('booking-destination-placeholder')}
                    testID="destination-search"
                />

                {pickup && destination && (
                    <View style={styles.routeInfo} testID="route-info">
                        {routeLoading ? (
                            <ActivityIndicator color={theme.colors.primary} />
                        ) : routeResult ? (
                            <>
                                <Text style={styles.routeMetric} testID="route-distance">
                                    {routeResult.distanceKm.toFixed(1)} km
                                </Text>
                                {estimateLoading ? (
                                    <ActivityIndicator
                                        color={theme.colors.primary}
                                        testID="estimate-loading"
                                    />
                                ) : estimate ? (
                                    <Text style={styles.routeMetric} testID="estimate-price">
                                        {estimate.estimatedPrice.toFixed(2)} {estimate.currency}
                                    </Text>
                                ) : (
                                    <Text style={styles.routeError} testID="estimate-error">
                                        {t('booking-estimate-failed')}
                                    </Text>
                                )}
                            </>
                        ) : (
                            <Text style={styles.routeError}>{t('booking-no-route')}</Text>
                        )}
                    </View>
                )}

                <Pressable
                    style={[styles.confirmButton, !canConfirm && styles.confirmButtonDisabled]}
                    disabled={!canConfirm}
                    onPress={handleConfirm}
                    testID="booking-confirm"
                >
                    {submitting ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={styles.confirmText}>{t('booking-confirm')}</Text>
                    )}
                </Pressable>
            </View>
        </View>
    );
};

export default BookingMapBody;
