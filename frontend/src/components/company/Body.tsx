import React from 'react';
import { View, ScrollView, Linking } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/Navigation';
import { createStyles } from './Body.style';
import { useTheme } from '../../hooks/useTheme';
import { useTranslation } from 'react-i18next';
import { useCompanies } from '../../hooks/useCompanies';
import { getVehicleOptions } from '../../constants/vehicleOptions';
import CompanyListHeader from './CompanyListHeader';
import CompanyCard from './CompanyCard';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import EmptyState from './EmptyState';

type CompanyListRouteProp = RouteProp<RootStackParamList, 'companyList'>;

const Body = () => {
    const route = useRoute<CompanyListRouteProp>();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { vehicleType } = route.params;

    const { theme } = useTheme();
    const styles = createStyles(theme);

    const { t } = useTranslation();
    const vehicleOptions = getVehicleOptions(t);
    const vehicleInfo = vehicleOptions.find(v => v.type === vehicleType);

    const { companies, loading, error, reload } = useCompanies(vehicleType);

    const handleCallCompany = (phoneNumber: string) => {
        Linking.openURL(`tel:${phoneNumber}`);
    };

    const handleBackPress = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <CompanyListHeader
                vehicleInfo={vehicleInfo}
                companiesCount={companies.length}
                loading={loading}
                onBackPress={handleBackPress}
            />

            {loading ? (
                <LoadingState />
            ) : error ? (
                <ErrorState error={error} onRetry={reload} />
            ) : companies.length === 0 ? (
                <EmptyState serviceName={vehicleInfo?.label} />
            ) : (
                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    <View style={styles.companiesList}>
                        {companies.map(company => (
                            <CompanyCard
                                key={company.id}
                                company={company}
                                onCall={handleCallCompany}
                            />
                        ))}
                    </View>
                </ScrollView>
            )}
        </View>
    );
};

export default Body;
