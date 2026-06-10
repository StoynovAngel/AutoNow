import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import type { RootStackParamList } from '../../navigation/Navigation';
import { getOrderById, type OrderResponse } from '../../services/orderService';
import { submitRating } from '../../services/ratingService';
import { createStyles } from './BookingCompleteBody.style';

type BookingCompleteRouteProp = RouteProp<RootStackParamList, 'bookingComplete'>;

const BookingCompleteBody = () => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const styles = createStyles(theme);

    const route = useRoute<BookingCompleteRouteProp>();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { orderId } = route.params;

    const [order, setOrder] = useState<OrderResponse | undefined>();
    const [loadError, setLoadError] = useState(false);
    const [stars, setStars] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | undefined>();

    useEffect(() => {
        let cancelled = false;
        getOrderById(orderId)
            .then((o) => {
                if (!cancelled) setOrder(o);
            })
            .catch(() => {
                if (!cancelled) setLoadError(true);
            });
        return () => {
            cancelled = true;
        };
    }, [orderId]);

    const goHome = () => {
        navigation.reset({ index: 0, routes: [{ name: 'home' }] });
    };

    const handleSubmit = async () => {
        if (stars === 0 || submitting) return;
        setSubmitting(true);
        setSubmitError(undefined);
        try {
            await submitRating({
                orderId,
                rating: stars,
                comment: comment.trim() ? comment.trim() : undefined,
            });
            goHome();
        } catch (e) {
            const msg = e instanceof Error ? e.message : t('rating-failed');
            setSubmitError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    const price = order?.finalPrice ?? order?.estimatedPrice;
    const canSubmit = stars > 0 && !submitting;

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                testID="booking-complete"
            >
                <View style={styles.header}>
                <MaterialIcons
                    name="check-circle"
                    size={56}
                    color={theme.colors.primary}
                />
                <Text style={styles.title}>{t('booking-completed')}</Text>
                <Text style={styles.subtitle}>{t('booking-completed-hint')}</Text>
            </View>

            {loadError && (
                <Text style={styles.errorText} testID="complete-load-error">
                    {t('booking-load-failed')}
                </Text>
            )}

            {order && (
                <View style={styles.card} testID="complete-summary">
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>{t('booking-from')}</Text>
                        <Text style={styles.summaryValue} numberOfLines={2}>
                            {order.pickupAddress}
                        </Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>{t('booking-to')}</Text>
                        <Text style={styles.summaryValue} numberOfLines={2}>
                            {order.dropoffAddress}
                        </Text>
                    </View>
                    {typeof order.distanceKm === 'number' && (
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>{t('booking-distance')}</Text>
                            <Text style={styles.summaryValue}>
                                {order.distanceKm.toFixed(1)} km
                            </Text>
                        </View>
                    )}
                    {typeof price === 'number' && (
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>{t('booking-final-price')}</Text>
                            <Text style={styles.priceValue} testID="complete-price">
                                {price.toFixed(2)} EUR
                            </Text>
                        </View>
                    )}
                </View>
            )}

            {order?.driver && (
                <View style={styles.card} testID="complete-rate">
                    <Text style={styles.rateTitle}>
                        {t('rating-rate-driver', {
                            name: `${order.driver.firstName} ${order.driver.lastName}`,
                        })}
                    </Text>
                    <View style={styles.starsRow}>
                        {[1, 2, 3, 4, 5].map((value) => (
                            <Pressable
                                key={value}
                                onPress={() => setStars(value)}
                                style={styles.star}
                                testID={`star-${value}`}
                            >
                                <MaterialIcons
                                    name={value <= stars ? 'star' : 'star-border'}
                                    size={36}
                                    color={value <= stars ? '#F59E0B' : theme.colors.textSecondary}
                                />
                            </Pressable>
                        ))}
                    </View>
                    <TextInput
                        style={styles.commentInput}
                        value={comment}
                        onChangeText={setComment}
                        placeholder={t('rating-comment-placeholder')}
                        placeholderTextColor={theme.colors.textSecondary}
                        multiline
                        testID="rating-comment"
                    />
                    {submitError && (
                        <Text style={styles.errorText} testID="rating-error">
                            {submitError}
                        </Text>
                    )}
                </View>
            )}

            <View style={styles.actionsRow}>
                <Pressable
                    style={styles.secondaryButton}
                    onPress={goHome}
                    testID="complete-skip"
                >
                    <Text style={styles.secondaryButtonText}>
                        {order?.driver ? t('rating-skip') : t('booking-back-home')}
                    </Text>
                </Pressable>
                {order?.driver && (
                    <Pressable
                        style={[
                            styles.primaryButton,
                            !canSubmit && styles.primaryButtonDisabled,
                        ]}
                        disabled={!canSubmit}
                        onPress={handleSubmit}
                        testID="complete-submit"
                    >
                        {submitting ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={styles.primaryButtonText}>
                                {t('rating-submit')}
                            </Text>
                        )}
                    </Pressable>
                )}
            </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default BookingCompleteBody;
