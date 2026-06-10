import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import { AuthContext } from '../../services/AuthContext';
import type { RootStackParamList } from '../../navigation/Navigation';
import { getRoute, searchAddress } from '../../services/mapboxService';
import type {
    AddressSuggestion,
    Coordinate,
    RouteResult,
} from '../../services/mapboxService';
import { createOrder, estimateOrder } from '../../services/orderService';
import type { OrderEstimateResponse } from '../../services/orderService';
import { VehicleType } from '../../types/vehicle';
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
    const { companyId, companyAddress, vehicleType, preferences } = route.params;

    const isAmbulance = vehicleType === VehicleType.AMBULANCE;

    const auth = useContext(AuthContext);

    const isLogistics = vehicleType === VehicleType.LOGISTICS;

    const [pickup, setPickup] = useState<AddressSuggestion | undefined>();
    const [destination, setDestination] = useState<AddressSuggestion | undefined>();
    const [routeResult, setRouteResult] = useState<RouteResult | undefined>();
    const [routeLoading, setRouteLoading] = useState(false);
    const [estimate, setEstimate] = useState<OrderEstimateResponse | undefined>();
    const [estimateLoading, setEstimateLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [weightKgInput, setWeightKgInput] = useState('');

    const _parsedWeight = parseFloat(weightKgInput);
    const weightKg = isLogistics ? (Number.isFinite(_parsedWeight) ? _parsedWeight : undefined) : undefined;
    const weightError = weightKg !== undefined && (weightKg < 0.1 || weightKg > 5000);

    // For logistics, geocode the company address once on mount and use it as pickup
    useEffect(() => {
        if (!isLogistics || !preferences.companyAddress) return;
        let cancelled = false;
        searchAddress(preferences.companyAddress)
            .then((results) => {
                if (!cancelled && results[0]) setPickup(results[0]);
            })
            .catch(() => {});
        return () => { cancelled = true; };
    }, [isLogistics, preferences.companyAddress]);

    const [pickupGeocodeError, setPickupGeocodeError] = useState(false);

    useEffect(() => {
        if (!isAmbulance || !companyAddress) return;
        setPickupGeocodeError(false);
        searchAddress(companyAddress)
            .then((results) => {
                if (results[0]) {
                    setPickup(results[0]);
                } else {
                    setPickupGeocodeError(true);
                }
            })
            .catch(() => setPickupGeocodeError(true));
    }, [isAmbulance, companyAddress]);

    useEffect(() => {
        if (!isAmbulance) return;
        if (!pickup || !destination) {
            setRouteResult(undefined);
            setEstimate(undefined);
            return;
        }
        let cancelled = false;
        setRouteLoading(true);
        getRoute(pickup.coordinate, destination.coordinate)
            .then((r) => { if (!cancelled) setRouteResult(r); })
            .catch(() => { if (!cancelled) setRouteResult(undefined); })
            .finally(() => { if (!cancelled) setRouteLoading(false); });
        return () => { cancelled = true; };
    }, [isAmbulance, pickup, destination]);

    useEffect(() => {
        if (!isAmbulance) return;
        if (!routeResult) {
            setEstimate(undefined);
            return;
        }
        let cancelled = false;
        setEstimate(undefined);
        setEstimateLoading(true);
        estimateOrder({ vehicleType, distanceKm: routeResult.distanceKm, vehicleClass: preferences.vehicleClass })
            .then((e) => { if (!cancelled) setEstimate(e); })
            .catch(() => { if (!cancelled) setEstimate(undefined); })
            .finally(() => { if (!cancelled) setEstimateLoading(false); });
        return () => { cancelled = true; };
    }, [isAmbulance, routeResult, vehicleType, preferences.vehicleClass]);

    // Standard flow: fetch route when both addresses are set
    useEffect(() => {
        if (isAmbulance) return;
        if (!pickup || !destination) {
            setRouteResult(undefined);
            return;
        }
        let cancelled = false;
        setRouteLoading(true);
        getRoute(pickup.coordinate, destination.coordinate)
            .then((r) => { if (!cancelled) setRouteResult(r); })
            .catch(() => { if (!cancelled) setRouteResult(undefined); })
            .finally(() => { if (!cancelled) setRouteLoading(false); });
        return () => { cancelled = true; };
    }, [isAmbulance, pickup, destination]);

    // Standard flow: estimate when route is ready
    useEffect(() => {
        if (isAmbulance) return;
        if (!routeResult) {
            setEstimate(undefined);
            setEstimateLoading(false);
            return;
        }
        if (isLogistics && weightKg === undefined) {
            setEstimate(undefined);
            return;
        }
        let cancelled = false;
        setEstimate(undefined);
        setEstimateLoading(true);
        estimateOrder({
            vehicleType,
            distanceKm: routeResult.distanceKm,
            vehicleClass: preferences.vehicleClass,
            weightKg,
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
    }, [routeResult, vehicleType, preferences.vehicleClass, weightKg, isLogistics]);

    const handleConfirm = async () => {
        if (!auth?.user) {
            Alert.alert(t('booking-must-login'));
            return;
        }

        if (isAmbulance) {
            if (!destination || !pickup) return;
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
                    distanceKm: routeResult?.distanceKm,
                    vehicleClass: preferences.vehicleClass,
                });
                navigation.replace('bookingWaiting', { orderId: created.id });
            } catch (e) {
                const msg = e instanceof Error ? e.message : 'Booking failed';
                Alert.alert(t('booking-failed'), msg);
            } finally {
                setSubmitting(false);
            }
            return;
        }

        if (!pickup || !destination || !routeResult) return;
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
                vehicleClass: preferences.vehicleClass,
                weightKg,
            });
            navigation.replace('bookingWaiting', { orderId: created.id });
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Booking failed';
            Alert.alert(t('booking-failed'), msg);
        } finally {
            setSubmitting(false);
        }
    };

    const canConfirm = isAmbulance
        ? Boolean(pickup && destination && estimate && !routeLoading && !estimateLoading && !submitting)
        : Boolean(
            pickup && destination && routeResult && estimate && !estimateLoading && !submitting &&
            (!isLogistics || (weightKg !== undefined && !weightError)),
        );
    void companyId;

    const proximity = (isAmbulance ? destination?.coordinate : pickup?.coordinate) ?? SOFIA_CENTER;

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
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
                <Text style={styles.title}>
                    {isAmbulance ? t('booking-ambulance-title') : t('booking-map-title')}
                </Text>

                {isAmbulance && (
                    <View style={styles.ambulanceOrigin} testID="ambulance-origin">
                        <MaterialIcons name="local-hospital" size={16} color={theme.colors.primary} />
                        {pickupGeocodeError ? (
                            <Text style={styles.routeError} testID="pickup-geocode-error">
                                {t('booking-pickup-geocode-failed')}
                            </Text>
                        ) : (
                            <Text style={styles.ambulanceOriginText} numberOfLines={1}>
                                {pickup?.placeName ?? companyAddress ?? '…'}
                            </Text>
                        )}
                    </View>
                )}

                {isLogistics ? (
                    <View style={styles.pickupFixed} testID="pickup-fixed">
                        <MaterialIcons name="store" size={16} color={theme.colors.textSecondary} />
                        <Text style={styles.pickupFixedText} numberOfLines={1}>
                            {pickup ? pickup.placeName : (preferences.companyAddress ?? '…')}
                        </Text>
                    </View>
                ) : !isAmbulance && (
                    <AddressSearch
                        proximity={proximity}
                        selected={pickup}
                        onSelect={setPickup}
                        onClear={() => setPickup(undefined)}
                        placeholder={t('booking-pickup-placeholder')}
                        testID="pickup-search"
                    />
                )}

                <AddressSearch
                    proximity={proximity}
                    selected={destination}
                    onSelect={setDestination}
                    onClear={() => setDestination(undefined)}
                    placeholder={
                        isAmbulance
                            ? t('booking-ambulance-destination-placeholder')
                            : t('booking-destination-placeholder')
                    }
                    testID="destination-search"
                />

                {isLogistics && (
                    <View style={styles.weightInputRow}>
                        <TextInput
                            style={[styles.weightInput, weightError && styles.weightInputError]}
                            value={weightKgInput}
                            onChangeText={setWeightKgInput}
                            placeholder={t('booking-logistics-weight-placeholder')}
                            placeholderTextColor={theme.colors.textSecondary}
                            keyboardType="numeric"
                            accessibilityLabel={t('booking-logistics-weight-placeholder')}
                            testID="weight-input"
                        />
                        <Text style={styles.weightUnit}>kg</Text>
                    </View>
                )}
                {isLogistics && weightError && (
                    <Text style={styles.weightError} testID="weight-error">
                        {t('booking-logistics-weight-error')}
                    </Text>
                )}

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
                        ) : isAmbulance && !pickup ? (
                            <ActivityIndicator color={theme.colors.primary} />
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
        </KeyboardAvoidingView>
    );
};

export default BookingMapBody;
