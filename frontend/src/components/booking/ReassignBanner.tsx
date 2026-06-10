import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import { createStyles } from './ReassignBanner.style';

const ReassignBanner = () => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const styles = createStyles(theme);

    return (
        <View
            style={styles.reassignBanner}
            testID="waiting-reassigned"
            accessibilityRole="alert"
            accessibilityLiveRegion="polite"
        >
            <MaterialIcons name="info" size={20} color="#92400E" />
            <Text style={styles.reassignBannerText}>{t('booking-waiting-reassigned')}</Text>
        </View>
    );
};

export default ReassignBanner;
