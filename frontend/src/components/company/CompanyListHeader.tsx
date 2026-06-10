import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { VehicleOption } from '../../types/vehicle';
import { theme } from '../../constants/theme';
import { createStyles } from './Body.style';
import { useTranslation } from 'react-i18next';

interface CompanyListHeaderProps {
    vehicleInfo: VehicleOption | undefined;
    companiesCount: number;
    loading: boolean;
    onBackPress: () => void;
}

const CompanyListHeader = ({ vehicleInfo, companiesCount, loading, onBackPress }: CompanyListHeaderProps) => {
    
    const styles = createStyles(theme);
    const { t } = useTranslation();

    return (
        <View style={styles.header}>
            <Pressable onPress={onBackPress} style={styles.backButton}>
                <MaterialIcons name="arrow-back" size={24} color={theme.colors.textPrimary} />
            </Pressable>
            <View style={styles.headerContent}>
                <View style={[styles.headerIcon, { backgroundColor: vehicleInfo?.color + '20' }]}>
                    <MaterialIcons
                        name={vehicleInfo?.icon as any}
                        size={28}
                        color={vehicleInfo?.color}
                    />
                </View>
                <View style={styles.headerText}>
                    <Text style={styles.headerTitle}>{vehicleInfo?.label}</Text>
                    <Text style={styles.headerSubtitle}>
                        {loading ? t('loading') : `${companiesCount} ${t('companies-available')}`}
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default CompanyListHeader;
