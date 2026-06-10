import { useContext, useEffect, useRef, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthContext } from '../services/AuthContext';
import { getActiveOrderByUserId } from '../services/orderService';
import type { RootStackParamList } from '../navigation/Navigation';
import { useAppForeground } from './useAppForeground';

export const useResumeActiveOrder = () => {
    const auth = useContext(AuthContext);
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const resumedRef = useRef(false);

    const check = useCallback((cancelled: { current: boolean }) => {
        if (!auth?.user || auth.loading || resumedRef.current) return;
        getActiveOrderByUserId(auth.user.id)
            .then((order) => {
                if (cancelled.current || !order) return;
                resumedRef.current = true;
                navigation.navigate('bookingWaiting', { orderId: order.id });
            })
            .catch(() => {
                // silently ignore — user can still book a new ride
            });
    }, [auth?.user, auth?.loading, navigation]);

    useEffect(() => {
        if (!auth?.user) {
            resumedRef.current = false;
            return;
        }
        const cancelled = { current: false };
        check(cancelled);
        return () => { cancelled.current = true; };
    }, [auth?.user, auth?.loading, check]);

    useAppForeground(() => {
        resumedRef.current = false;
        const cancelled = { current: false };
        check(cancelled);
    });
};
