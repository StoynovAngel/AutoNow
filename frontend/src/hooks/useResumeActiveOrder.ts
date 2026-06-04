import { useContext, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthContext } from '../services/AuthContext';
import { getActiveOrderByUserId } from '../services/orderService';
import type { RootStackParamList } from '../navigation/Navigation';

export const useResumeActiveOrder = () => {
    const auth = useContext(AuthContext);
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    useEffect(() => {
        if (!auth?.user || auth.loading) return;
        let cancelled = false;
        getActiveOrderByUserId(auth.user.id)
            .then((order) => {
                if (cancelled || !order) return;
                navigation.navigate('bookingWaiting', { orderId: order.id });
            })
            .catch(() => {
                // silently ignore — user can still book a new ride
            });
        return () => {
            cancelled = true;
        };
    }, [auth?.user, auth?.loading, navigation]);
};
