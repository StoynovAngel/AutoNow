import { useContext, useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthContext } from '../services/AuthContext';
import { getActiveOrderByUserId } from '../services/orderService';
import type { RootStackParamList } from '../navigation/Navigation';

export const useResumeActiveOrder = () => {
    const auth = useContext(AuthContext);
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const resumedRef = useRef(false);

    useEffect(() => {
        if (!auth?.user) {
            resumedRef.current = false;
            return;
        }
        if (auth.loading || resumedRef.current) return;
        let cancelled = false;
        getActiveOrderByUserId(auth.user.id)
            .then((order) => {
                if (cancelled || !order) return;
                resumedRef.current = true;
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
