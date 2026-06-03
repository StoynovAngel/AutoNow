import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import type { VehicleClass } from '../../types/booking';
import { VEHICLE_CLASSES } from '../../types/booking';
import { XL_PASSENGER_THRESHOLD } from '../../constants/booking';
import { createStyles } from './VehicleClassPicker.style';

interface VehicleClassPickerProps {
    value?: VehicleClass;
    passengerCount?: number;
    onChange: (next: VehicleClass | undefined) => void;
}

const hintKey = (cls: VehicleClass): string => {
    switch (cls) {
        case 'STANDARD':
            return 'booking-class-standard-hint';
        case 'XL':
            return 'booking-class-xl-hint';
        case 'PREMIUM':
            return 'booking-class-premium-hint';
    }
};

const labelKey = (cls: VehicleClass): string => {
    switch (cls) {
        case 'STANDARD':
            return 'booking-class-standard';
        case 'XL':
            return 'booking-class-xl';
        case 'PREMIUM':
            return 'booking-class-premium';
    }
};

const VehicleClassPicker = ({ value, passengerCount, onChange }: VehicleClassPickerProps) => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const styles = createStyles(theme);

    const standardLocked =
        passengerCount !== undefined && passengerCount >= XL_PASSENGER_THRESHOLD;

    const handlePress = (cls: VehicleClass) => {
        if (cls === 'STANDARD' && standardLocked) return;
        onChange(value === cls ? undefined : cls);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{t('booking-vehicle-class')}</Text>
            <View style={styles.cards}>
                {VEHICLE_CLASSES.map((cls) => {
                    const disabled = cls === 'STANDARD' && standardLocked;
                    const selected = value === cls;
                    return (
                        <Pressable
                            key={cls}
                            style={[
                                styles.card,
                                selected && styles.cardSelected,
                                disabled && styles.cardDisabled,
                            ]}
                            onPress={() => handlePress(cls)}
                            disabled={disabled}
                            testID={`vehicle-class-${cls}`}
                        >
                            <Text style={styles.cardLabel}>{t(labelKey(cls))}</Text>
                            <Text style={styles.cardHint}>{t(hintKey(cls))}</Text>
                        </Pressable>
                    );
                })}
            </View>
            {standardLocked && (
                <Text style={styles.lockedHint}>{t('booking-class-locked-xl')}</Text>
            )}
        </View>
    );
};

export default VehicleClassPicker;
