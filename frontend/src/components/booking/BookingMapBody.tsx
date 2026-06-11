import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { theme } from '../../constants/theme';
import { AuthContext } from '../../services/AuthContext';
import type { RootStackParamList } from '../../navigation/Navigation';
import { getRoute, searchAddress } from '../../services/mapboxService';
import type { Coordinate, AddressSuggestion, RouteResult } from '../../services/mapboxService';
import { createOrder, estimateOrder } from '../../services/orderService';
import type { OrderEstimateResponse } from '../../services/orderService';
import { VehicleType } from '../../types/vehicle';
import AddressSearch from './AddressSearch';
import MapHeader from './MapHeader';
import PickupRow from './PickupRow';
import WeightInput from './WeightInput';
import RouteSummary from './RouteSummary';
import ConfirmButton from './ConfirmButton';
import { createStyles } from './BookingMapBody.style';

type BookingMapRouteProp = RouteProp<RootStackParamList, 'bookingMap'>;

const SOFIA_CENTER: Coordinate = { latitude: 42.6977, longitude: 23.3219 };

const BookingMapBody = () => {

    const { t } = useTranslation();
    const styles = createStyles(theme);

    const route = useRoute<BookingMapRouteProp>();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { companyAddress, vehicleType, preferences } = route.params;

    const auth = useContext(AuthContext);
    const isAmbulance = vehicleType === VehicleType.AMBULANCE;
    const isLogistics = vehicleType === VehicleType.LOGISTICS;

    const [pickup, setPickup] = useState<AddressSuggestion | undefined>();
    const [destination, setDestination] = useState<AddressSuggestion | undefined>();
    const [routeResult, setRouteResult] = useState<RouteResult | undefined>();
    const [routeLoading, setRouteLoading] = useState(false);
    const [estimate, setEstimate] = useState<OrderEstimateResponse | undefined>();
    const [estimateLoading, setEstimateLoading] = useState(false);
    const [pickupGeocodeError, setPickupGeocodeError] = useState(false);
    const [weightKgInput, setWeightKgInput] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const parsedWeight = parseFloat(weightKgInput);
    const weightKg = isLogistics && Number.isFinite(parsedWeight) ? parsedWeight : undefined;
    const weightError = weightKg !== undefined && (weightKg < 0.1 || weightKg > 5000);

    useEffect(() => {
        if (!isLogistics || !preferences.companyAddress) return;
        let cancelled = false;
        searchAddress(preferences.companyAddress)
            .then((results) => { if (!cancelled && results[0]) setPickup(results[0]); })
            .catch(() => {});
        return () => { cancelled = true; };
    }, [isLogistics, preferences.companyAddress]);

    useEffect(() => {
        if (!isAmbulance || !companyAddress) return;
        setPickupGeocodeError(false);
        let cancelled = false;
        searchAddress(companyAddress)
            .then((results) => {
                if (cancelled) return;
                if (results[0]) setPickup(results[0]);
                else setPickupGeocodeError(true);
            })
            .catch(() => { if (!cancelled) setPickupGeocodeError(true); });
        return () => { cancelled = true; };
    }, [isAmbulance, companyAddress]);

    useEffect(() => {
        if (!pickup || !destination) { setRouteResult(undefined); return; }
        let cancelled = false;
        setRouteLoading(true);
        getRoute(pickup.coordinate, destination.coordinate)
            .then((r) => { if (!cancelled) setRouteResult(r); })
            .catch(() => { if (!cancelled) setRouteResult(undefined); })
            .finally(() => { if (!cancelled) setRouteLoading(false); });
        return () => { cancelled = true; };
    }, [pickup, destination]);

    useEffect(() => {
        if (!routeResult) { setEstimate(undefined); setEstimateLoading(false); return; }
        if (isLogistics && weightKg === undefined) { setEstimate(undefined); setEstimateLoading(false); return; }
        let cancelled = false;
        setEstimate(undefined);
        setEstimateLoading(true);
        estimateOrder({
            vehicleType,
            distanceKm: routeResult.distanceKm,
            ...(isLogistics ? { weightKg } : {}),
        })
            .then((e) => { if (!cancelled) setEstimate(e); })
            .catch(() => { if (!cancelled) setEstimate(undefined); })
            .finally(() => { if (!cancelled) setEstimateLoading(false); });
        return () => { cancelled = true; };
    }, [routeResult, vehicleType, weightKg, isLogistics]);

    const handleConfirm = async () => {
        if (!auth?.user) { Alert.alert(t('booking-must-login')); return; }
        if (!pickup || !destination) return;
        if (!isAmbulance && !routeResult) return;
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
                ...(isLogistics ? { weightKg } : {}),
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

    const proximity = (isAmbulance ? destination?.coordinate : pickup?.coordinate) ?? SOFIA_CENTER;

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <MapHeader
                pickup={pickup?.coordinate}
                destination={destination?.coordinate}
                route={routeResult}
            />

            <View style={styles.sheet}>
                <Text style={styles.title}>
                    {isAmbulance ? t('booking-ambulance-title') : t('booking-map-title')}
                </Text>

                {isAmbulance && (
                    <PickupRow
                        variant="ambulance"
                        placeName={pickup?.placeName}
                        fallbackAddress={companyAddress}
                        geocodeError={pickupGeocodeError}
                    />
                )}

                {isLogistics ? (
                    <PickupRow
                        variant="logistics"
                        placeName={pickup?.placeName}
                        fallbackAddress={preferences.companyAddress}
                    />
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
                    <WeightInput
                        value={weightKgInput}
                        onChange={setWeightKgInput}
                        error={weightError}
                    />
                )}

                {pickup && destination && (
                    <RouteSummary
                        routeLoading={routeLoading}
                        routeResult={routeResult}
                        estimate={estimate}
                        estimateLoading={estimateLoading}
                        isAmbulance={isAmbulance}
                        pickupReady={true}
                    />
                )}

                <ConfirmButton
                    enabled={canConfirm}
                    submitting={submitting}
                    onPress={handleConfirm}
                />
            </View>
        </KeyboardAvoidingView>
    );
};

export default BookingMapBody;
