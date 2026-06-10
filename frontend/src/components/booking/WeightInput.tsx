import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import { createStyles } from './WeightInput.style';

interface WeightInputProps {
    value: string;
    onChange: (next: string) => void;
    error: boolean;
}

const WeightInput = ({ value, onChange, error }: WeightInputProps) => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const styles = createStyles(theme);

    return (
        <>
            <View style={styles.weightInputRow}>
                <TextInput
                    style={[styles.weightInput, error && styles.weightInputError]}
                    value={value}
                    onChangeText={onChange}
                    placeholder={t('booking-logistics-weight-placeholder')}
                    placeholderTextColor={theme.colors.textSecondary}
                    keyboardType="numeric"
                    accessibilityLabel={t('booking-logistics-weight-placeholder')}
                    testID="weight-input"
                />
                <Text style={styles.weightUnit}>kg</Text>
            </View>
            {error && (
                <Text
                    style={styles.weightError}
                    testID="weight-error"
                    accessibilityRole="alert"
                    accessibilityLiveRegion="assertive"
                >
                    {t('booking-logistics-weight-error')}
                </Text>
            )}
        </>
    );
};

export default WeightInput;
