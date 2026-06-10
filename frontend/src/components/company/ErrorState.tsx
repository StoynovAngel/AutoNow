import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { createStyles } from './Body.style';
import { useTranslation } from 'react-i18next';

interface ErrorStateProps {
    error: string;
    onRetry: () => void;
}

const ErrorState = ({ error, onRetry }: ErrorStateProps) => {

    const styles = createStyles(theme);
    const { t } = useTranslation();

    return (
        <View style={styles.errorState}>
            <MaterialIcons name="error-outline" size={64} color="#EF4444" />
            <Text style={styles.errorTitle}>{t('error-loading')}</Text>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable style={styles.retryButton} onPress={onRetry}>
                <Text style={styles.retryButtonText}>{t('retry')}</Text>
            </Pressable>
        </View>
    );
};

export default ErrorState;
