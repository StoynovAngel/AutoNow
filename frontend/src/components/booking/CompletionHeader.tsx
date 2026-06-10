import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import { createStyles } from './CompletionHeader.style';

const CompletionHeader = () => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const styles = createStyles(theme);

    return (
        <View style={styles.header}>
            <MaterialIcons name="check-circle" size={56} color={theme.colors.primary} />
            <Text style={styles.title}>{t('booking-completed')}</Text>
            <Text style={styles.subtitle}>{t('booking-completed-hint')}</Text>
        </View>
    );
};

export default CompletionHeader;
