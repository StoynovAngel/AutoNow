import React from "react";
import { SafeAreaView } from 'react-native-safe-area-context';
import Body from "../../components/auth/login/Body";

const Login = () => {
    return (
        <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
            <Body />
        </SafeAreaView>
    );
};

export default Login;