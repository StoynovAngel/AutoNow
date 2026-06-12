import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './BookingMap.style';
import BookingMapBody from '../../components/booking/BookingMapBody';

const BookingMap = () => {
    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <BookingMapBody />
        </SafeAreaView>
    );
};

export default BookingMap;
