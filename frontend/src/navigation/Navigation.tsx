import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Home from '../screens/home/Home';
import Register from "../screens/auth/Register";
import Login from "../screens/auth/Login";
import CompanyList from '../screens/company/CompanyList';
import BookingPreferences from '../screens/booking/BookingPreferences';
import BookingMap from '../screens/booking/BookingMap';
import BookingWaiting from '../screens/booking/BookingWaiting';
import BookingComplete from '../screens/booking/BookingComplete';
import { VehicleType } from '../types/vehicle';
import type { BookingPreferences as BookingPreferencesData } from '../types/booking';

export type RootStackParamList = {
    home: undefined;
    login: undefined;
    register: undefined;
    profile: { userId: number };
    companyList: { vehicleType: VehicleType };
    bookingPreferences: { companyId: number; vehicleType: VehicleType };
    bookingMap: {
        companyId: number;
        vehicleType: VehicleType;
        preferences: BookingPreferencesData;
    };
    bookingWaiting: { orderId: number };
    bookingComplete: { orderId: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigation = () => {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="home" component={Home}/>
            <Stack.Screen name="login" component={Login}/>
            <Stack.Screen name="register" component={Register}/>
            <Stack.Screen name="companyList" component={CompanyList}/>
            <Stack.Screen name="bookingPreferences" component={BookingPreferences}/>
            <Stack.Screen name="bookingMap" component={BookingMap}/>
            <Stack.Screen name="bookingWaiting" component={BookingWaiting}/>
            <Stack.Screen name="bookingComplete" component={BookingComplete}/>
        </Stack.Navigator>
    );
};

export default Navigation;
