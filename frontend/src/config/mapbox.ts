/**
 * Mapbox configuration.
 *
 * The token is a CLIENT-side public token (pk.*). It ships in the app bundle —
 * that is by design. Protect it via Mapbox dashboard restrictions:
 *   - Restrict to your app's bundle ID / URL
 *   - Set a $0 spend cap so over-quota requests are rejected, not billed
 *
 * The token is loaded from .env at build time via Expo's EXPO_PUBLIC_* convention.
 * Add EXPO_PUBLIC_MAPBOX_TOKEN to frontend/.env (see .env.example).
 */
export const MAPBOX_TOKEN: string = process.env.EXPO_PUBLIC_MAPBOX_TOKEN ?? '';

export const isMapboxConfigured = (): boolean => MAPBOX_TOKEN.startsWith('pk.');

export const assertMapboxConfigured = (): void => {
    if (!isMapboxConfigured()) {
        throw new Error(
            'Mapbox token is missing. Set EXPO_PUBLIC_MAPBOX_TOKEN in frontend/.env',
        );
    }
};
