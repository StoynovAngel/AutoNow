/**
 * Mapbox REST API client for geocoding (forward + reverse) and directions.
 *
 * Uses the public token from src/config/mapbox.ts. All endpoints are
 * idempotent GETs against api.mapbox.com — works identically on web and native.
 */
import { MAPBOX_TOKEN, assertMapboxConfigured } from '../config/mapbox';

const BASE_URL = 'https://api.mapbox.com';

export interface Coordinate {
    longitude: number;
    latitude: number;
}

export interface AddressSuggestion {
    id: string;
    placeName: string;
    coordinate: Coordinate;
}

export interface RouteResult {
    distanceKm: number;
    geometry: {
        type: 'LineString';
        coordinates: [number, number][];
    };
}

const buildUrl = (path: string, params: Record<string, string | number>): string => {
    const url = new URL(`${BASE_URL}${path}`);
    url.searchParams.set('access_token', MAPBOX_TOKEN);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
    return url.toString();
};

const ensureOk = async (res: Response, label: string): Promise<unknown> => {
    if (!res.ok) {
        const body = await res.text().catch(() => '');
        throw new Error(`Mapbox ${label} failed (${res.status}): ${body || res.statusText}`);
    }
    return res.json();
};

interface GeocodingFeature {
    id: string;
    place_name: string;
    center: [number, number];
}
interface GeocodingResponse {
    features: GeocodingFeature[];
}

export const searchAddress = async (
    query: string,
    proximity?: Coordinate,
): Promise<AddressSuggestion[]> => {
    assertMapboxConfigured();
    const trimmed = query.trim();
    if (trimmed.length < 2) return [];

    const params: Record<string, string | number> = {
        autocomplete: 'true',
        limit: 5,
        country: 'BG',
        language: 'en',
    };
    if (proximity) {
        params.proximity = `${proximity.longitude},${proximity.latitude}`;
    }

    const url = buildUrl(
        `/geocoding/v5/mapbox.places/${encodeURIComponent(trimmed)}.json`,
        params,
    );
    const res = await fetch(url);
    const json = (await ensureOk(res, 'geocoding')) as GeocodingResponse;
    return json.features.map((f) => ({
        id: f.id,
        placeName: f.place_name,
        coordinate: { longitude: f.center[0], latitude: f.center[1] },
    }));
};

interface DirectionsResponse {
    routes: Array<{
        distance: number;
        geometry: { type: 'LineString'; coordinates: [number, number][] };
    }>;
}

export const getRoute = async (from: Coordinate, to: Coordinate): Promise<RouteResult> => {
    assertMapboxConfigured();
    const coords = `${from.longitude},${from.latitude};${to.longitude},${to.latitude}`;
    const url = buildUrl(`/directions/v5/mapbox/driving/${coords}`, {
        geometries: 'geojson',
        overview: 'full',
        language: 'en',
    });
    const res = await fetch(url);
    const json = (await ensureOk(res, 'directions')) as DirectionsResponse;
    const route = json.routes[0];
    if (!route) throw new Error('No route found');
    return {
        distanceKm: route.distance / 1000,
        geometry: route.geometry,
    };
};
