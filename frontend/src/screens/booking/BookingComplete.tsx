import React from 'react';
import { View } from 'react-native';
import styles from './BookingComplete.style';
import BookingCompleteBody from '../../components/booking/BookingCompleteBody';

const BookingComplete = () => {
    return (
        <View style={styles.container}>
            <BookingCompleteBody />
        </View>
    );
};

export default BookingComplete;
