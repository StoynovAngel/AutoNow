import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Home from '../screens/home/Home';
import Register from "../screens/auth/Register";
import Login from "../screens/auth/Login";
import CompanyList from '../screens/company/CompanyList';
import BookingMap from '../screens/booking/BookingMap';
import BookingWaiting from '../screens/booking/BookingWaiting';
import BookingComplete from '../screens/booking/BookingComplete';
import PromVehicles from '../screens/vehicle/PromVehicles';
import { VehicleType } from '../types/vehicle';
import type { BookingPreferences as BookingPreferencesData } from '../types/booking';

export type RootStackParamList = {
    home: undefined;
    login: undefined;
    register: undefined;
    profile: { userId: number };
    companyList: { vehicleType: VehicleType };
    bookingMap: {
        companyId: number;
        vehicleType: VehicleType;
        preferences: BookingPreferencesData;
    };
    bookingWaiting: { orderId: number };
    bookingComplete: { orderId: number };
    promVehicles: { companyId: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigation = () => {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="home" component={Home}/>
            <Stack.Screen name="login" component={Login}/>
            <Stack.Screen name="register" component={Register}/>
            <Stack.Screen name="companyList" component={CompanyList}/>
            <Stack.Screen name="bookingMap" component={BookingMap}/>
            <Stack.Screen name="bookingWaiting" component={BookingWaiting}/>
            <Stack.Screen name="bookingComplete" component={BookingComplete}/>
            <Stack.Screen name="promVehicles" component={PromVehicles}/>
        </Stack.Navigator>
    );
};

export default Navigation;
