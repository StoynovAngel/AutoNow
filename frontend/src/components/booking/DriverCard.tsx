import React from 'react';
import { View, Text, Pressable, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { theme } from '../../constants/theme';
import type { OrderResponse } from '../../services/orderService';
import { createStyles } from './DriverCard.style';

interface DriverCardProps {
    driver: NonNullable<OrderResponse['driver']>;
    vehicle?: OrderResponse['vehicle'];
}

const DriverCard = ({ driver, vehicle }: DriverCardProps) => {

    const { t } = useTranslation();
    const styles = createStyles(theme);

    const handleCall = async () => {
        if (!driver.phoneNumber) return;
        try {
            await Linking.openURL(`tel:${driver.phoneNumber}`);
        } catch (e) {
            console.warn('Failed to open phone dialer:', e);
        }
    };

    return (
        <View style={styles.driverCard} testID="waiting-driver">
            <View style={styles.driverRow}>
                <MaterialIcons name="person" size={28} color={theme.colors.textPrimary} />
                <View style={styles.driverInfo}>
                    <Text style={styles.driverName}>
                        {driver.firstName} {driver.lastName}
                    </Text>
                    {vehicle && (
                        <Text style={styles.driverMeta} testID="waiting-vehicle">
                            {vehicle.brand} {vehicle.model} · {vehicle.licensePlate}
                        </Text>
                    )}
                </View>
            </View>
            <Pressable
                style={styles.callButton}
                onPress={handleCall}
                testID="waiting-call"
                accessibilityRole="button"
                accessibilityLabel={t('booking-waiting-call-driver')}
            >
                <MaterialIcons name="phone" size={18} color="#FFFFFF" />
                <Text style={styles.callButtonText}>{driver.phoneNumber}</Text>
            </Pressable>
        </View>
    );
};

export default DriverCard;
