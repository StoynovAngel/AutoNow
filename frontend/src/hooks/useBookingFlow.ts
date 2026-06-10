import { useEffect, useState } from 'react';
import { getRoute, searchAddress } from '../services/mapboxService';
import type {
    AddressSuggestion,
    RouteResult,
} from '../services/mapboxService';
import { estimateOrder } from '../services/orderService';
import type { OrderEstimateResponse } from '../services/orderService';
import { VehicleType } from '../types/vehicle';
import type { BookingPreferences } from '../types/booking';

interface UseBookingFlowParams {
    vehicleType: VehicleType;
    preferences: BookingPreferences;
    companyAddress?: string;
}

export interface BookingFlowState {
    pickup: AddressSuggestion | undefined;
    setPickup: (s: AddressSuggestion | undefined) => void;
    destination: AddressSuggestion | undefined;
    setDestination: (s: AddressSuggestion | undefined) => void;
    routeResult: RouteResult | undefined;
    routeLoading: boolean;
    estimate: OrderEstimateResponse | undefined;
    estimateLoading: boolean;
    pickupGeocodeError: boolean;
    weightKgInput: string;
    setWeightKgInput: (v: string) => void;
    weightKg: number | undefined;
    weightError: boolean;
    isAmbulance: boolean;
    isLogistics: boolean;
}

export const useBookingFlow = ({
    vehicleType,
    preferences,
    companyAddress,
}: UseBookingFlowParams): BookingFlowState => {
    const isAmbulance = vehicleType === VehicleType.AMBULANCE;
    const isLogistics = vehicleType === VehicleType.LOGISTICS;

    const [pickup, setPickup] = useState<AddressSuggestion | undefined>();
    const [destination, setDestination] = useState<AddressSuggestion | undefined>();
    const [routeResult, setRouteResult] = useState<RouteResult | undefined>();
    const [routeLoading, setRouteLoading] = useState(false);
    const [estimate, setEstimate] = useState<OrderEstimateResponse | undefined>();
    const [estimateLoading, setEstimateLoading] = useState(false);
    const [pickupGeocodeError, setPickupGeocodeError] = useState(false);
    const [weightKgInput, setWeightKgInput] = useState('');

    const parsedWeight = parseFloat(weightKgInput);
    const weightKg = isLogistics
        ? Number.isFinite(parsedWeight)
            ? parsedWeight
            : undefined
        : undefined;
    const weightError = weightKg !== undefined && (weightKg < 0.1 || weightKg > 5000);

    // Logistics: geocode the company address once and lock it as pickup.
    useEffect(() => {
        if (!isLogistics || !preferences.companyAddress) return;
        let cancelled = false;
        searchAddress(preferences.companyAddress)
            .then((results) => {
                if (!cancelled && results[0]) setPickup(results[0]);
            })
            .catch(() => {});
        return () => {
            cancelled = true;
        };
    }, [isLogistics, preferences.companyAddress]);

    // Ambulance: geocode the company (hospital) address as pickup.
    useEffect(() => {
        if (!isAmbulance || !companyAddress) return;
        setPickupGeocodeError(false);
        let cancelled = false;
        searchAddress(companyAddress)
            .then((results) => {
                if (cancelled) return;
                if (results[0]) {
                    setPickup(results[0]);
                } else {
                    setPickupGeocodeError(true);
                }
            })
            .catch(() => {
                if (!cancelled) setPickupGeocodeError(true);
            });
        return () => {
            cancelled = true;
        };
    }, [isAmbulance, companyAddress]);

    // Compute the route whenever both pickup + destination are set.
    useEffect(() => {
        if (!pickup || !destination) {
            setRouteResult(undefined);
            return;
        }
        let cancelled = false;
        setRouteLoading(true);
        getRoute(pickup.coordinate, destination.coordinate)
            .then((r) => {
                if (!cancelled) setRouteResult(r);
            })
            .catch(() => {
                if (!cancelled) setRouteResult(undefined);
            })
            .finally(() => {
                if (!cancelled) setRouteLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [pickup, destination]);

    // Estimate price once we have a route. Logistics also requires a valid weight.
    useEffect(() => {
        if (!routeResult) {
            setEstimate(undefined);
            setEstimateLoading(false);
            return;
        }
        if (isLogistics && weightKg === undefined) {
            setEstimate(undefined);
            return;
        }
        let cancelled = false;
        setEstimate(undefined);
        setEstimateLoading(true);
        estimateOrder({
            vehicleType,
            distanceKm: routeResult.distanceKm,
            vehicleClass: preferences.vehicleClass,
            ...(isLogistics ? { weightKg } : {}),
        })
            .then((e) => {
                if (!cancelled) setEstimate(e);
            })
            .catch(() => {
                if (!cancelled) setEstimate(undefined);
            })
            .finally(() => {
                if (!cancelled) setEstimateLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [routeResult, vehicleType, preferences.vehicleClass, weightKg, isLogistics]);

    return {
        pickup,
        setPickup,
        destination,
        setDestination,
        routeResult,
        routeLoading,
        estimate,
        estimateLoading,
        pickupGeocodeError,
        weightKgInput,
        setWeightKgInput,
        weightKg,
        weightError,
        isAmbulance,
        isLogistics,
    };
};
