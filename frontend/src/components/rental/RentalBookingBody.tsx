import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, ActivityIndicator, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import type { RootStackParamList } from '../../navigation/Navigation';
import { theme } from '../../constants/theme';
import { createStyles } from './RentalBookingBody.style';
import { estimateRentalOrder } from '../../services/rentalOrderService';

type RentalBookingRouteProp = RouteProp<RootStackParamList, 'rentalBooking'>;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();

interface DatePickerModalProps {
    visible: boolean;
    value: Date;
    minimumDate: Date;
    onConfirm: (date: Date) => void;
    onCancel: () => void;
}

const DatePickerModal = ({ visible, value, minimumDate, onConfirm, onCancel }: DatePickerModalProps) => {
    const { t } = useTranslation();
    const today = minimumDate;
    const [day, setDay] = useState(value.getDate());
    const [month, setMonth] = useState(value.getMonth());
    const [year, setYear] = useState(value.getFullYear());

    const maxDay = daysInMonth(month, year);
    const safeDay = Math.min(day, maxDay);

    const clampToMin = (d: number, m: number, y: number): { d: number; m: number; y: number } => {
        const chosen = new Date(y, m, d);
        if (chosen < today) return { d: today.getDate(), m: today.getMonth(), y: today.getFullYear() };
        return { d, m, y };
    };

    const adjust = (field: 'day' | 'month' | 'year', delta: number) => {
        let d = safeDay, m = month, y = year;
        if (field === 'day') d = Math.max(1, Math.min(daysInMonth(m, y), d + delta));
        if (field === 'month') { m = (m + delta + 12) % 12; d = Math.min(d, daysInMonth(m, y)); }
        if (field === 'year') { y = Math.max(today.getFullYear(), y + delta); d = Math.min(d, daysInMonth(m, y)); }
        const clamped = clampToMin(d, m, y);
        setDay(clamped.d); setMonth(clamped.m); setYear(clamped.y);
    };

    const handleConfirm = () => onConfirm(new Date(year, month, safeDay));

    const col = (label: string, value: string, onUp: () => void, onDown: () => void) => (
        <View style={{ alignItems: 'center', flex: 1 }}>
            <Text style={{ fontSize: 11, color: '#6B7280', marginBottom: 4 }}>{label}</Text>
            <Pressable onPress={onUp} style={{ padding: 8 }} testID={`picker-up-${label}`}>
                <MaterialIcons name="keyboard-arrow-up" size={28} color={theme.colors.primary} />
            </Pressable>
            <Text style={{ fontSize: 22, fontWeight: '700', color: theme.colors.textPrimary, minWidth: 44, textAlign: 'center' }}>{value}</Text>
            <Pressable onPress={onDown} style={{ padding: 8 }} testID={`picker-down-${label}`}>
                <MaterialIcons name="keyboard-arrow-down" size={28} color={theme.colors.primary} />
            </Pressable>
        </View>
    );

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
            <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }} onPress={onCancel}>
                <Pressable style={{ backgroundColor: '#fff', borderRadius: 20, padding: 24, width: 300 }} onPress={e => e.stopPropagation()}>
                    <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                        {col(t('picker-day'), String(safeDay).padStart(2, '0'), () => adjust('day', 1), () => adjust('day', -1))}
                        {col(t('picker-month'), MONTHS[month], () => adjust('month', 1), () => adjust('month', -1))}
                        {col(t('picker-year'), String(year), () => adjust('year', 1), () => adjust('year', -1))}
                    </View>
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        <Pressable onPress={onCancel} style={{ flex: 1, padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#D1D5DB', alignItems: 'center' }} testID="date-picker-cancel">
                            <Text style={{ color: '#374151', fontWeight: '600' }}>{t('picker-cancel')}</Text>
                        </Pressable>
                        <Pressable onPress={handleConfirm} style={{ flex: 1, padding: 12, borderRadius: 10, backgroundColor: theme.colors.primary, alignItems: 'center' }} testID="date-picker-confirm">
                            <Text style={{ color: '#fff', fontWeight: '600' }}>{t('picker-ok')}</Text>
                        </Pressable>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

const RentalBookingBody = () => {
    const route = useRoute<RentalBookingRouteProp>();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { t } = useTranslation();
    const styles = createStyles(theme);

    const { vehicleId, vehicleBrand, vehicleModel, vehiclePlate, vehicleImageUrl, companyId } = route.params;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);

    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 3);

    const [startDate, setStartDate] = useState<Date>(tomorrow);
    const [endDate, setEndDate] = useState<Date>(dayAfter);
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const dateError = endDate <= startDate ? t('rental-date-error') : null;

    const formatDate = (d: Date) =>
        d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });

    const handleStartConfirm = (date: Date) => {
        setShowStartPicker(false);
        setStartDate(date);
        if (date >= endDate) {
            const newEnd = new Date(date);
            newEnd.setDate(newEnd.getDate() + 1);
            setEndDate(newEnd);
        }
    };

    const handleEndConfirm = (date: Date) => {
        setShowEndPicker(false);
        setEndDate(date);
    };

    const handleConfirm = async () => {
        if (dateError) return;
        setLoading(true);
        setError(null);
        try {
            const estimate = await estimateRentalOrder({
                vehicleId,
                rentalStartDate: startDate.toISOString(),
                rentalEndDate: endDate.toISOString(),
            });
            navigation.navigate('rentalReview', {
                vehicleId,
                vehicleBrand,
                vehicleModel,
                vehiclePlate,
                vehicleImageUrl,
                companyId,
                estimate,
                rentalStartDate: startDate.toISOString(),
                rentalEndDate: endDate.toISOString(),
            });
        } catch {
            setError(t('rental-booking-failed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                    testID="rental-booking-back"
                    accessible
                    accessibilityRole="button"
                    accessibilityLabel={t('back')}
                >
                    <MaterialIcons name="arrow-back" size={24} color={theme.colors.textPrimary} />
                </Pressable>
                <Text style={styles.headerTitle}>{t('rental-book-title')}</Text>
                <Text style={styles.vehicleLabel}>{vehicleBrand} {vehicleModel}</Text>
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.vehicleCard}>
                    {vehicleImageUrl ? (
                        <Image source={{ uri: vehicleImageUrl }} style={styles.vehicleImage} resizeMode="cover" testID="rental-vehicle-image" />
                    ) : (
                        <View style={styles.vehicleImagePlaceholder} testID="rental-vehicle-image-placeholder">
                            <MaterialIcons name="car-rental" size={56} color={theme.colors.textSecondary} />
                        </View>
                    )}
                    <View style={styles.vehicleInfo}>
                        <Text style={styles.vehicleName}>{vehicleBrand} {vehicleModel}</Text>
                        <Text style={styles.vehiclePlate}>{vehiclePlate}</Text>
                    </View>
                </View>

                <View style={styles.dateSection}>
                    <View>
                        <Text style={styles.dateLabel}>{t('rental-start-date')}</Text>
                        <Pressable
                            style={styles.dateButton}
                            onPress={() => setShowStartPicker(true)}
                            testID="rental-start-date-button"
                            accessible
                            accessibilityRole="button"
                            accessibilityLabel={t('rental-start-date')}
                        >
                            <MaterialIcons name="event" size={20} color={theme.colors.primary} />
                            <Text style={styles.dateButtonText}>{formatDate(startDate)}</Text>
                            <MaterialIcons name="chevron-right" size={20} color={theme.colors.textSecondary} />
                        </Pressable>
                    </View>

                    <View>
                        <Text style={styles.dateLabel}>{t('rental-end-date')}</Text>
                        <Pressable
                            style={styles.dateButton}
                            onPress={() => setShowEndPicker(true)}
                            testID="rental-end-date-button"
                            accessible
                            accessibilityRole="button"
                            accessibilityLabel={t('rental-end-date')}
                        >
                            <MaterialIcons name="event" size={20} color={theme.colors.primary} />
                            <Text style={styles.dateButtonText}>{formatDate(endDate)}</Text>
                            <MaterialIcons name="chevron-right" size={20} color={theme.colors.textSecondary} />
                        </Pressable>
                        {dateError && (
                            <Text style={styles.errorText} accessibilityRole="alert">{dateError}</Text>
                        )}
                    </View>
                </View>

                {error && (
                    <View style={styles.errorAlert} accessibilityRole="alert" accessibilityLiveRegion="assertive">
                        <Text style={styles.errorAlertText}>{error}</Text>
                    </View>
                )}

                <Pressable
                    style={[styles.confirmButton, (loading || !!dateError) && styles.confirmButtonDisabled]}
                    onPress={handleConfirm}
                    disabled={loading || !!dateError}
                    testID="rental-confirm-button"
                    accessible
                    accessibilityRole="button"
                    accessibilityLabel={t('rental-confirm')}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={styles.confirmButtonText}>{t('rental-confirm')}</Text>
                    )}
                </Pressable>
            </ScrollView>

            <DatePickerModal
                visible={showStartPicker}
                value={startDate}
                minimumDate={tomorrow}
                onConfirm={handleStartConfirm}
                onCancel={() => setShowStartPicker(false)}
            />
            <DatePickerModal
                visible={showEndPicker}
                value={endDate}
                minimumDate={startDate}
                onConfirm={handleEndConfirm}
                onCancel={() => setShowEndPicker(false)}
            />
        </View>
    );
};

export default RentalBookingBody;
