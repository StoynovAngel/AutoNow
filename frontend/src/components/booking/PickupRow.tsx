import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { theme } from '../../constants/theme';
import { createStyles } from './PickupRow.style';

type PickupRowVariant = 'ambulance' | 'logistics';

interface PickupRowProps {
    variant: PickupRowVariant;
    placeName?: string;
    fallbackAddress?: string;
    geocodeError?: boolean;
}

const PickupRow = ({ variant, placeName, fallbackAddress, geocodeError }: PickupRowProps) => {

    const { t } = useTranslation();
    const styles = createStyles(theme);

    if (variant === 'ambulance') {
        return (
            <View style={styles.ambulanceOrigin} testID="ambulance-origin">
                <MaterialIcons name="local-hospital" size={16} color={theme.colors.primary} />
                {geocodeError ? (
                    <Text style={styles.errorText} testID="pickup-geocode-error">
                        {t('booking-pickup-geocode-failed')}
                    </Text>
                ) : (
                    <Text style={styles.ambulanceOriginText} numberOfLines={1}>
                        {placeName ?? fallbackAddress ?? '…'}
                    </Text>
                )}
            </View>
        );
    }

    return (
        <View style={styles.pickupFixed} testID="pickup-fixed">
            <MaterialIcons name="store" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.pickupFixedText} numberOfLines={1}>
                {placeName ?? fallbackAddress ?? '…'}
            </Text>
        </View>
    );
};

export default PickupRow;
