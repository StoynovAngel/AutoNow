import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { StyleSheet } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import type { RootStackParamList } from '../../navigation/Navigation';

type BookingCompleteRouteProp = RouteProp<RootStackParamList, 'bookingComplete'>;

const BookingCompleteBody = () => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const route = useRoute<BookingCompleteRouteProp>();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { orderId } = route.params;

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
            padding: 20,
            paddingTop: 56,
            gap: 16,
        },
        title: {
            fontSize: 22,
            fontWeight: '700',
            color: theme.colors.textPrimary,
            textAlign: 'center',
        },
        button: {
            backgroundColor: theme.colors.primary,
            borderRadius: 12,
            paddingVertical: 14,
            alignItems: 'center',
        },
        buttonText: {
            color: '#FFFFFF',
            fontWeight: '700',
            fontSize: 16,
        },
    });

    void orderId;

    return (
        <View style={styles.container} testID="booking-complete">
            <Text style={styles.title}>{t('booking-completed')}</Text>
            <Pressable
                style={styles.button}
                onPress={() => navigation.reset({ index: 0, routes: [{ name: 'home' }] })}
                testID="complete-home"
            >
                <Text style={styles.buttonText}>{t('booking-back-home')}</Text>
            </Pressable>
        </View>
    );
};

export default BookingCompleteBody;
