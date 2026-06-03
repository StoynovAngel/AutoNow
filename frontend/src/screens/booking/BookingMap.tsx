import React from 'react';
import { View } from 'react-native';
import styles from './BookingMap.style';
import BookingMapBody from '../../components/booking/BookingMapBody';

const BookingMap = () => {
    return (
        <View style={styles.container}>
            <BookingMapBody />
        </View>
    );
};

export default BookingMap;
