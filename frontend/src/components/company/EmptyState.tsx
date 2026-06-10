import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { createStyles } from './Body.style';
import { useTranslation } from 'react-i18next';

interface EmptyStateProps {
    serviceName: string | undefined;
}

const EmptyState = ({ serviceName }: EmptyStateProps) => {

    const styles = createStyles(theme);
    const { t } = useTranslation();

    return (
        <View style={styles.emptyState}>
            <MaterialIcons
                name="search-off"
                size={64}
                color={theme.colors.textSecondary}
            />
            <Text style={styles.emptyStateTitle}>{t('no-companies-found')}</Text>
            <Text style={styles.emptyStateText}>
                {t('no-companies-description', { service: serviceName })}
            </Text>
        </View>
    );
};

export default EmptyState;
