import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import RentalBookingBody from '../../components/rental/RentalBookingBody';

const RentalBooking = () => (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <RentalBookingBody />
    </SafeAreaView>
);

const styles = StyleSheet.create({
    container: { flex: 1 },
});

export default RentalBooking;
