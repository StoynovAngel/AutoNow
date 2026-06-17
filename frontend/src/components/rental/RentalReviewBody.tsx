import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import type { RootStackParamList } from '../../navigation/Navigation';
import { theme } from '../../constants/theme';
import { createStyles } from './RentalReviewBody.style';
import { useAuth } from '../../hooks/useAuth';
import { createRentalOrder } from '../../services/rentalOrderService';

type RentalReviewRouteProp = RouteProp<RootStackParamList, 'rentalReview'>;

const RentalReviewBody = () => {
    const route = useRoute<RentalReviewRouteProp>();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { t } = useTranslation();
    const { user } = useAuth();
    const styles = createStyles(theme);

    const { vehicleId, vehicleBrand, vehicleModel, vehiclePlate, vehicleImageUrl, companyId, estimate, rentalStartDate, rentalEndDate } = route.params;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });

    const formatCurrency = (amount: number) => new Intl.NumberFormat(undefined, { style: 'currency', currency: estimate.currency }).format(amount);

    const handleConfirm = async () => {
        if (!user) {
            setError(t('booking-must-login'));
            return;
        }

        setLoading(true);
        setError(null);
        try {
            await createRentalOrder({
                vehicleId,
                companyId,
                rentalStartDate,
                rentalEndDate,
            });
            navigation.reset({ index: 0, routes: [{ name: 'home' }] });
        } catch {
            setError(t('rental-booking-failed'));
        } finally {
            setLoading(false);
        }
    };

    const totalCharged = estimate.totalPrice + estimate.securityDeposit;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                    testID="rental-review-back"
                    accessible
                    accessibilityRole="button"
                    accessibilityLabel={t('back')}
                >
                    <MaterialIcons name="arrow-back" size={24} color={theme.colors.textPrimary} />
                </Pressable>
                <Text style={styles.headerTitle}>{t('rental-review-title')}</Text>
                <Text style={styles.vehicleLabel}>{vehicleBrand} {vehicleModel}</Text>
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.vehicleCard}>
                    {vehicleImageUrl ? (
                        <Image source={{ uri: vehicleImageUrl }} style={styles.vehicleImage} resizeMode="cover" testID="review-vehicle-image" />
                    ) : (
                        <View style={styles.vehicleImagePlaceholder} testID="review-vehicle-image-placeholder">
                            <MaterialIcons name="car-rental" size={48} color={theme.colors.textSecondary} />
                        </View>
                    )}
                    <View style={styles.vehicleInfo}>
                        <Text style={styles.vehicleName}>{vehicleBrand} {vehicleModel}</Text>
                        <Text style={styles.vehiclePlate}>{vehiclePlate}</Text>
                    </View>
                </View>

                <View style={styles.datesCard}>
                    <MaterialIcons name="date-range" size={20} color={theme.colors.primary} />
                    <Text style={styles.datesText} testID="review-dates">
                        {formatDate(rentalStartDate)} → {formatDate(rentalEndDate)}
                    </Text>
                </View>

                <View style={styles.pricingCard}>
                    <Text style={styles.pricingTitle}>{t('rental-price-breakdown')}</Text>

                    <View style={styles.pricingRow}>
                        <Text style={styles.pricingLabel} testID="review-rental-line">
                            {t('rental-days', { count: estimate.rentalDays })} × {formatCurrency(estimate.pricePerDay)}
                        </Text>
                        <Text style={styles.pricingValue} testID="review-rental-total">{formatCurrency(estimate.totalPrice)}</Text>
                    </View>

                    <View style={styles.pricingRow}>
                        <Text style={styles.pricingLabel} testID="review-deposit-label">{t('rental-security-deposit')}</Text>
                        <Text style={styles.pricingValue} testID="review-deposit-value">{formatCurrency(estimate.securityDeposit)}</Text>
                    </View>
                    <Text style={styles.depositNote}>{t('rental-deposit-note')}</Text>

                    <View style={styles.divider} />

                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>{t('rental-total-today')}</Text>
                        <Text style={styles.totalValue} testID="review-total">{formatCurrency(totalCharged)}</Text>
                    </View>
                </View>

                {error && (
                    <View style={styles.errorAlert} accessibilityRole="alert" accessibilityLiveRegion="assertive">
                        <Text style={styles.errorAlertText}>{error}</Text>
                    </View>
                )}

                <Pressable
                    style={[styles.confirmButton, loading && styles.confirmButtonDisabled]}
                    onPress={handleConfirm}
                    disabled={loading}
                    testID="rental-review-confirm-button"
                    accessible
                    accessibilityRole="button"
                    accessibilityLabel={t('rental-confirm-booking')}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={styles.confirmButtonText}>{t('rental-confirm-booking')}</Text>
                    )}
                </Pressable>
            </ScrollView>
        </View>
    );
};

export default RentalReviewBody;
