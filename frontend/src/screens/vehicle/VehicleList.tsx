import React from 'react';
import { View } from 'react-native';
import styles from './VehicleList.style';
import VehicleListBody from '../../components/vehicle/VehicleListBody';

const VehicleList = () => {
    return (
        <View style={styles.container}>
            <VehicleListBody />
        </View>
    );
};

export default VehicleList;
