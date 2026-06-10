import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './VehicleList.style';
import VehicleListBody from '../../components/vehicle/VehicleListBody';

const VehicleList = () => {
    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <VehicleListBody />
        </SafeAreaView>
    );
};

export default VehicleList;
