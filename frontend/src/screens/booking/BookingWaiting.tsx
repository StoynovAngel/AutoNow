import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './BookingWaiting.style';
import BookingWaitingBody from '../../components/booking/BookingWaitingBody';

const BookingWaiting = () => {
    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <BookingWaitingBody />
        </SafeAreaView>
    );
};

export default BookingWaiting;
