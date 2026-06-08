import React from 'react';
import { View } from 'react-native';
import styles from './PromVehicles.style';
import PromVehiclesBody from '../../components/vehicle/PromVehiclesBody';

const PromVehicles = () => {
    return (
        <View style={styles.container}>
            <PromVehiclesBody />
        </View>
    );
};

export default PromVehicles;
