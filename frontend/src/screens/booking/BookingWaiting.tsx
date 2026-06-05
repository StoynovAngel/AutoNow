import React from 'react';
import { View } from 'react-native';
import styles from './BookingWaiting.style';
import BookingWaitingBody from '../../components/booking/BookingWaitingBody';

const BookingWaiting = () => {
    return (
        <View style={styles.container}>
            <BookingWaitingBody />
        </View>
    );
};

export default BookingWaiting;
