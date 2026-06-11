import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '../../constants/theme';
import { createStyles } from './TaxiInputs.style';

interface TaxiInputsProps {
    passengerCount: string;
    luggageCount: string;
    onPassengerCountChange: (v: string) => void;
    onLuggageCountChange: (v: string) => void;
    passengerError: boolean;
}

const TaxiInputs = ({
    passengerCount,
    luggageCount,
    onPassengerCountChange,
    onLuggageCountChange,
    passengerError,
}: TaxiInputsProps) => {
    const { t } = useTranslation();
    const styles = createStyles(theme);

    return (
        <>
            <View style={styles.row}>
                <TextInput
                    style={[styles.input, passengerError && styles.inputError]}
                    value={passengerCount}
                    onChangeText={onPassengerCountChange}
                    placeholder={t('booking-taxi-passengers-placeholder')}
                    placeholderTextColor={theme.colors.textSecondary}
                    keyboardType="numeric"
                    accessibilityLabel={t('booking-taxi-passengers-placeholder')}
                    testID="passenger-count-input"
                />
                <TextInput
                    style={styles.input}
                    value={luggageCount}
                    onChangeText={onLuggageCountChange}
                    placeholder={t('booking-taxi-luggage-placeholder')}
                    placeholderTextColor={theme.colors.textSecondary}
                    keyboardType="numeric"
                    accessibilityLabel={t('booking-taxi-luggage-placeholder')}
                    testID="luggage-count-input"
                />
            </View>
            {passengerError && (
                <Text
                    style={styles.error}
                    testID="passenger-error"
                    accessibilityRole="alert"
                    accessibilityLiveRegion="assertive"
                >
                    {t('booking-taxi-passengers-error')}
                </Text>
            )}
        </>
    );
};

export default TaxiInputs;
