import React from 'react';
import { View, Text, Switch } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import { createStyles } from './AirConditioningToggle.style';

interface AirConditioningToggleProps {
    value?: boolean;
    onChange: (next: boolean | undefined) => void;
}

const AirConditioningToggle = ({ value, onChange }: AirConditioningToggleProps) => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const styles = createStyles(theme);

    const required = value === true;

    const handleToggle = (next: boolean) => {
        onChange(next ? true : undefined);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{t('booking-air-conditioning')}</Text>
            <Switch
                value={required}
                onValueChange={handleToggle}
                testID="ac-toggle"
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            />
        </View>
    );
};

export default AirConditioningToggle;
