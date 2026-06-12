import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { theme } from '../../constants/theme';
import { createStyles } from './Body.style';
import { useTranslation } from 'react-i18next';

const LoadingState = () => {

    const styles = createStyles(theme);
    const { t } = useTranslation();

    return (
        <View style={styles.loadingState}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>{t('loading-companies')}</Text>
        </View>
    );
};

export default LoadingState;
