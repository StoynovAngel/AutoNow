import React, { useContext, useState } from 'react';
import { View, Text, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import { AuthContext } from '../../services/AuthContext';
import type { RootStackParamList } from '../../navigation/Navigation';
import type { Coordinate } from '../../services/mapboxService';
import { createOrder } from '../../services/orderService';
import { useBookingFlow } from '../../hooks/useBookingFlow';
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
    const { theme } = useTheme();
    const { t } = useTranslation();
    const styles = createStyles(theme);

    const route = useRoute<BookingMapRouteProp>();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { companyAddress, vehicleType, preferences } = route.params;

    const auth = useContext(AuthContext);
    const [submitting, setSubmitting] = useState(false);

    const flow = useBookingFlow({ vehicleType, preferences, companyAddress });
    const {
        pickup,
        setPickup,
        destination,
        setDestination,
        routeResult,
        routeLoading,
        estimate,
        estimateLoading,
        pickupGeocodeError,
        weightKgInput,
        setWeightKgInput,
        weightKg,
        weightError,
        isAmbulance,
        isLogistics,
    } = flow;

    const handleConfirm = async () => {
        if (!auth?.user) {
            Alert.alert(t('booking-must-login'));
            return;
        }
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
                vehicleClass: preferences.vehicleClass,
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
                        pickupReady={Boolean(pickup)}
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
