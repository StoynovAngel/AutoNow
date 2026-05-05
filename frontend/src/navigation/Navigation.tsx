import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Home from '../screens/home/Home';
import Register from "../screens/auth/Register";
import Login from "../screens/auth/Login";

export type RootStackParamList = {
    home: undefined;
    login: undefined;
    register: undefined;
    profile: { userId: number };
    test: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigation = () => {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="home" component={Home}/>
            <Stack.Screen name="login" component={Login}/>
            <Stack.Screen name="register" component={Register}/>
        </Stack.Navigator>
    );
};

export default Navigation;