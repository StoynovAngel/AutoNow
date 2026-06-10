import React, { useEffect, useState } from 'react';
import { Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { theme } from '../../constants/theme';
import type { RootStackParamList } from '../../navigation/Navigation';
import { getOrderById, type OrderResponse } from '../../services/orderService';
import { submitRating } from '../../services/ratingService';
import CompletionHeader from './CompletionHeader';
import OrderSummary from './OrderSummary';
import RatingCard from './RatingCard';
import CompletionActions from './CompletionActions';
import { createStyles } from './BookingCompleteBody.style';

type BookingCompleteRouteProp = RouteProp<RootStackParamList, 'bookingComplete'>;

const BookingCompleteBody = () => {
    
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

    const hasDriver = Boolean(order?.driver);
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
                <CompletionHeader />

                {loadError && (
                    <Text style={styles.errorText} testID="complete-load-error">
                        {t('booking-load-failed')}
                    </Text>
                )}

                {order && <OrderSummary order={order} />}

                {order?.driver && (
                    <RatingCard
                        driverName={`${order.driver.firstName} ${order.driver.lastName}`}
                        stars={stars}
                        onStarsChange={setStars}
                        comment={comment}
                        onCommentChange={setComment}
                        error={submitError}
                    />
                )}

                <CompletionActions
                    hasDriver={hasDriver}
                    canSubmit={canSubmit}
                    submitting={submitting}
                    onSkip={goHome}
                    onSubmit={handleSubmit}
                />
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default BookingCompleteBody;
