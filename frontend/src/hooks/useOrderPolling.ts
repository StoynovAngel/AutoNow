import { useCallback, useEffect, useRef, useState } from 'react';
import { getOrderById, type OrderResponse } from '../services/orderService';

const POLL_INTERVAL_MS = 5000;
const REASSIGN_BANNER_MS = 6000;

export type OrderPollingState = {
    order: OrderResponse | undefined;
    error: string | undefined;
    reassigned: boolean;
    setOrder: (order: OrderResponse) => void;
    stop: () => void;
};

export const useOrderPolling = (
    orderId: number,
    onTerminal: (order: OrderResponse) => void,
): OrderPollingState => {
    const [order, setOrder] = useState<OrderResponse | undefined>();
    const [error, setError] = useState<string | undefined>();
    const [reassigned, setReassigned] = useState(false);

    const stoppedRef = useRef(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const reassignTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const previousDriverIdRef = useRef<number | undefined>(undefined);
    const onTerminalRef = useRef(onTerminal);
    onTerminalRef.current = onTerminal;

    const stop = useCallback(() => {
        stoppedRef.current = true;
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        if (reassignTimerRef.current) {
            clearTimeout(reassignTimerRef.current);
            reassignTimerRef.current = null;
        }
    }, []);

    const poll = useCallback(async () => {
        if (stoppedRef.current) return;
        try {
            const next = await getOrderById(orderId);
            if (stoppedRef.current) return;

            const previousDriverId = previousDriverIdRef.current;
            const nextDriverId = next.driver?.id;
            if (
                previousDriverId != null &&
                nextDriverId != null &&
                previousDriverId !== nextDriverId
            ) {
                setReassigned(true);
                if (reassignTimerRef.current) clearTimeout(reassignTimerRef.current);
                reassignTimerRef.current = setTimeout(() => {
                    if (!stoppedRef.current) setReassigned(false);
                }, REASSIGN_BANNER_MS);
            }
            previousDriverIdRef.current = nextDriverId;

            setOrder(next);
            setError(undefined);

            if (next.status === 'COMPLETED' || next.status === 'CANCELED') {
                onTerminalRef.current(next);
                return;
            }
        } catch (e) {
            if (stoppedRef.current) return;
            const msg = e instanceof Error ? e.message : 'error';
            setError(msg);
        }
        if (stoppedRef.current) return;
        timerRef.current = setTimeout(poll, POLL_INTERVAL_MS);
    }, [orderId]);

    useEffect(() => {
        stoppedRef.current = false;
        poll();
        return stop;
    }, [poll, stop]);

    return { order, error, reassigned, setOrder, stop };
};
