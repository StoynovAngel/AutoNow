import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Home from '../screens/home/Home';

export type RootStackParamList = {
    home: undefined;
    login: undefined;
    profile: { userId: number };
    test: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigation = () => {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="home" component={Home}/>
        </Stack.Navigator>
    );
};

export default Navigation;