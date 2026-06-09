import React from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Linking, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import type { RootStackParamList } from '../../navigation/Navigation';
import { useTheme } from '../../hooks/useTheme';
import { usePublicVehicles } from '../../hooks/usePublicVehicles';
import { VehicleType, PublicVehicle } from '../../types/vehicle';
import { createStyles } from './VehicleListBody.style';

type VehicleListRouteProp = RouteProp<RootStackParamList, 'vehicleList'>;

const VehicleListBody = () => {
    const route = useRoute<VehicleListRouteProp>();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { companyId, vehicleType } = route.params;

    const { theme } = useTheme();
    const styles = createStyles(theme);
    const { t } = useTranslation();

    const { vehicles, loading, error, reload } = usePublicVehicles(companyId, vehicleType);

    const vehicleIcon = vehicleType === VehicleType.RENTAL ? 'car-rental' : 'directions-car';

    const handleBack = () => navigation.goBack();

    const handleCall = async (phoneNumber?: string) => {
        if (!phoneNumber) return;
        try {
            await Linking.openURL(`tel:${phoneNumber}`);
        } catch (e) {
            console.warn('Failed to open phone dialer:', e);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable
                    style={styles.backButton}
                    onPress={handleBack}
                    testID="vehicle-list-back"
                >
                    <MaterialIcons name="arrow-back" size={24} color={theme.colors.textPrimary} />
                </Pressable>
                <Text style={styles.headerTitle}>{t('vehicle-list-title')}</Text>
                <Text style={styles.headerSubtitle}>{t('vehicle-list-subtitle')}</Text>
            </View>

            {loading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                    <Text style={styles.emptyText}>{t('vehicle-list-loading')}</Text>
                </View>
            ) : error ? (
                <View style={styles.centered}>
                    <MaterialIcons name="error-outline" size={64} color="#EF4444" />
                    <Text style={styles.emptyTitle}>{t('error-loading')}</Text>
                    <Text style={styles.errorText}>{error}</Text>
                    <Pressable style={styles.retryButton} onPress={reload} testID="vehicle-list-retry">
                        <Text style={styles.retryButtonText}>{t('retry')}</Text>
                    </Pressable>
                </View>
            ) : vehicles.length === 0 ? (
                <View style={styles.centered}>
                    <MaterialIcons name="search-off" size={64} color={theme.colors.textSecondary} />
                    <Text style={styles.emptyTitle}>{t('vehicle-list-empty-title')}</Text>
                    <Text style={styles.emptyText}>{t('vehicle-list-empty-description')}</Text>
                </View>
            ) : (
                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    <View style={styles.list}>
                        {vehicles.map((vehicle: PublicVehicle) => (
                            <View key={vehicle.id} style={styles.card}>
                                {vehicle.imageUrl ? (
                                    <Image
                                        source={{ uri: vehicle.imageUrl }}
                                        style={styles.cardImage}
                                        resizeMode="cover"
                                        testID={`vehicle-image-${vehicle.id}`}
                                    />
                                ) : (
                                    <View
                                        style={[styles.cardImage, styles.cardImagePlaceholder]}
                                        testID={`vehicle-image-placeholder-${vehicle.id}`}
                                    >
                                        <MaterialIcons
                                            name={vehicleIcon}
                                            size={48}
                                            color={theme.colors.textSecondary}
                                        />
                                    </View>
                                )}
                                <View style={styles.cardBody}>
                                    <View style={styles.cardInfo}>
                                        <Text style={styles.cardTitle}>
                                            {vehicle.brand} {vehicle.model}
                                        </Text>
                                        <View style={styles.detailRow}>
                                            <MaterialIcons
                                                name="confirmation-number"
                                                size={16}
                                                color={theme.colors.textSecondary}
                                            />
                                            <Text style={styles.detailText}>{vehicle.licensePlate}</Text>
                                        </View>
                                        {vehicle.numberOfSeats !== undefined && (
                                            <View style={styles.detailRow}>
                                                <MaterialIcons
                                                    name="event-seat"
                                                    size={16}
                                                    color={theme.colors.textSecondary}
                                                />
                                                <Text style={styles.detailText}>
                                                    {t('vehicle-list-seats', { count: vehicle.numberOfSeats })}
                                                </Text>
                                            </View>
                                        )}
                                    </View>

                                    <Pressable
                                        style={[
                                            styles.callButton,
                                            !vehicle.driverPhoneNumber && styles.callButtonDisabled,
                                        ]}
                                        onPress={() => handleCall(vehicle.driverPhoneNumber)}
                                        disabled={!vehicle.driverPhoneNumber}
                                        testID={`vehicle-call-${vehicle.id}`}
                                    >
                                        <MaterialIcons name="phone" size={24} color="#FFFFFF" />
                                    </Pressable>
                                </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            )}
        </View>
    );
};

export default VehicleListBody;
