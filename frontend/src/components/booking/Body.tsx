import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import type { RootStackParamList } from '../../navigation/Navigation';
import type { BookingPreferences, VehicleClass } from '../../types/booking';
import {
    PASSENGER_MIN,
    PASSENGER_MAX,
    LUGGAGE_MIN,
    LUGGAGE_MAX,
    XL_PASSENGER_THRESHOLD,
} from '../../constants/booking';
import Counter from './Counter';
import VehicleClassPicker from './VehicleClassPicker';
import AirConditioningToggle from './AirConditioningToggle';
import { createStyles } from './Body.style';

type BookingPreferencesRouteProp = RouteProp<RootStackParamList, 'bookingPreferences'>;

const Body = () => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const styles = createStyles(theme);

    const route = useRoute<BookingPreferencesRouteProp>();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { companyId, vehicleType } = route.params;

    const [preferences, setPreferences] = useState<BookingPreferences>({});

    const setPassengerCount = (next: number | undefined) => {
        setPreferences((prev) => {
            const updated: BookingPreferences = { ...prev, passengerCount: next };
            if (next !== undefined && next >= XL_PASSENGER_THRESHOLD && prev.vehicleClass === 'STANDARD') {
                updated.vehicleClass = 'XL';
            }
            return updated;
        });
    };

    const setLuggageCount = (next: number | undefined) => {
        setPreferences((prev) => ({ ...prev, luggageCount: next }));
    };

    const setVehicleClass = (next: VehicleClass | undefined) => {
        setPreferences((prev) => ({ ...prev, vehicleClass: next }));
    };

    const setRequiresAirConditioning = (next: boolean | undefined) => {
        setPreferences((prev) => ({ ...prev, requiresAirConditioning: next }));
    };

    const goToMap = (prefs: BookingPreferences) => {
        navigation.navigate('bookingMap', {
            companyId,
            vehicleType,
            preferences: prefs,
        });
    };

    const handleSkip = () => goToMap({});
    const handleContinue = () => goToMap(preferences);
    const handleBack = () => navigation.goBack();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerRow}>
                    <Pressable
                        style={styles.backButton}
                        onPress={handleBack}
                        testID="booking-back"
                    >
                        <MaterialIcons name="arrow-back" size={24} color={theme.colors.textPrimary} />
                    </Pressable>
                    <Pressable
                        style={styles.skipButton}
                        onPress={handleSkip}
                        testID="booking-skip"
                    >
                        <Text style={styles.skipText}>{t('booking-skip')}</Text>
                    </Pressable>
                </View>
                <Text style={styles.title}>{t('booking-title')}</Text>
                <Text style={styles.subtitle}>{t('booking-subtitle')}</Text>
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
                <Counter
                    label={t('booking-passengers')}
                    value={preferences.passengerCount}
                    min={PASSENGER_MIN}
                    max={PASSENGER_MAX}
                    onChange={setPassengerCount}
                    testID="passengers"
                />
                <Counter
                    label={t('booking-luggage')}
                    value={preferences.luggageCount}
                    min={LUGGAGE_MIN}
                    max={LUGGAGE_MAX}
                    onChange={setLuggageCount}
                    testID="luggage"
                />
                <VehicleClassPicker
                    value={preferences.vehicleClass}
                    passengerCount={preferences.passengerCount}
                    onChange={setVehicleClass}
                />
                <AirConditioningToggle
                    value={preferences.requiresAirConditioning}
                    onChange={setRequiresAirConditioning}
                />
            </ScrollView>

            <View style={styles.footer}>
                <Pressable
                    style={styles.continueButton}
                    onPress={handleContinue}
                    testID="booking-continue"
                >
                    <Text style={styles.continueText}>{t('booking-continue')}</Text>
                </Pressable>
            </View>
        </View>
    );
};

export default Body;
