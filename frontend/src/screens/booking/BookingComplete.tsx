import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './BookingComplete.style';
import BookingCompleteBody from '../../components/booking/BookingCompleteBody';

const BookingComplete = () => {
    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <BookingCompleteBody />
        </SafeAreaView>
    );
};

export default BookingComplete;
