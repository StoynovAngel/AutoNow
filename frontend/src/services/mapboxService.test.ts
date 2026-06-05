import { searchAddress, reverseGeocode, getRoute } from './mapboxService';

jest.mock('../config/mapbox', () => ({
    MAPBOX_TOKEN: 'pk.test-token',
    isMapboxConfigured: () => true,
    assertMapboxConfigured: jest.fn(),
}));

const mockFetch = jest.fn();
(global as unknown as { fetch: typeof fetch }).fetch = mockFetch as unknown as typeof fetch;

const okJson = (body: unknown): Response =>
    ({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => body,
        text: async () => JSON.stringify(body),
    }) as unknown as Response;

const errResponse = (status: number, body = 'boom'): Response =>
    ({
        ok: false,
        status,
        statusText: 'Bad Request',
        json: async () => ({ message: body }),
        text: async () => body,
    }) as unknown as Response;

describe('mapboxService', () => {
    beforeEach(() => {
        mockFetch.mockReset();
    });

    describe('searchAddress', () => {
        it('returns [] for queries shorter than 2 characters without hitting the API', async () => {
            const result = await searchAddress('a');
            expect(result).toEqual([]);
            expect(mockFetch).not.toHaveBeenCalled();
        });

        it('builds the autocomplete URL with token, country, and limit', async () => {
            mockFetch.mockResolvedValue(okJson({ features: [] }));

            await searchAddress('Vitosha');

            const url = mockFetch.mock.calls[0][0] as string;
            expect(url).toContain('/geocoding/v5/mapbox.places/Vitosha.json');
            expect(url).toContain('access_token=pk.test-token');
            expect(url).toContain('autocomplete=true');
            expect(url).toContain('country=BG');
            expect(url).toContain('limit=5');
        });

        it('passes proximity bias when given', async () => {
            mockFetch.mockResolvedValue(okJson({ features: [] }));

            await searchAddress('park', { latitude: 42.7, longitude: 23.3 });

            const url = mockFetch.mock.calls[0][0] as string;
            expect(url).toContain('proximity=23.3%2C42.7');
        });

        it('maps features into AddressSuggestion shape', async () => {
            mockFetch.mockResolvedValue(
                okJson({
                    features: [
                        {
                            id: 'place.1',
                            place_name: 'Vitosha Blvd, Sofia, Bulgaria',
                            center: [23.32, 42.69],
                        },
                    ],
                }),
            );

            const result = await searchAddress('Vitosha');

            expect(result).toEqual([
                {
                    id: 'place.1',
                    placeName: 'Vitosha Blvd, Sofia, Bulgaria',
                    coordinate: { longitude: 23.32, latitude: 42.69 },
                },
            ]);
        });

        it('throws a descriptive error on non-OK responses', async () => {
            mockFetch.mockResolvedValue(errResponse(401, 'unauthorized'));

            await expect(searchAddress('Vitosha')).rejects.toThrow(/geocoding failed \(401\)/);
        });
    });

    describe('reverseGeocode', () => {
        it('builds the reverse URL using lng,lat ordering', async () => {
            mockFetch.mockResolvedValue(okJson({ features: [] }));

            await reverseGeocode({ latitude: 42.69, longitude: 23.32 });

            const url = mockFetch.mock.calls[0][0] as string;
            expect(url).toContain('/geocoding/v5/mapbox.places/23.32,42.69.json');
        });

        it('returns the first feature place_name', async () => {
            mockFetch.mockResolvedValue(
                okJson({
                    features: [{ id: 'p', place_name: 'Sofia Center', center: [23.32, 42.69] }],
                }),
            );

            const result = await reverseGeocode({ latitude: 42.69, longitude: 23.32 });

            expect(result).toBe('Sofia Center');
        });

        it('returns undefined when no features are returned', async () => {
            mockFetch.mockResolvedValue(okJson({ features: [] }));

            const result = await reverseGeocode({ latitude: 42.69, longitude: 23.32 });

            expect(result).toBeUndefined();
        });
    });

    describe('getRoute', () => {
        it('builds the directions URL with both coordinates and geojson geometry', async () => {
            mockFetch.mockResolvedValue(
                okJson({
                    routes: [
                        {
                            distance: 5000,
                            geometry: { type: 'LineString', coordinates: [[0, 0], [1, 1]] },
                        },
                    ],
                }),
            );

            await getRoute(
                { latitude: 42.7, longitude: 23.3 },
                { latitude: 42.65, longitude: 23.4 },
            );

            const url = mockFetch.mock.calls[0][0] as string;
            expect(url).toContain('/directions/v5/mapbox/driving/23.3,42.7;23.4,42.65');
            expect(url).toContain('geometries=geojson');
            expect(url).toContain('overview=full');
        });

        it('converts distance from meters to km', async () => {
            mockFetch.mockResolvedValue(
                okJson({
                    routes: [
                        {
                            distance: 5234,
                            geometry: { type: 'LineString', coordinates: [] },
                        },
                    ],
                }),
            );

            const result = await getRoute(
                { latitude: 0, longitude: 0 },
                { latitude: 1, longitude: 1 },
            );

            expect(result.distanceKm).toBeCloseTo(5.234);
        });

        it('throws when the API returns no routes', async () => {
            mockFetch.mockResolvedValue(okJson({ routes: [] }));

            await expect(
                getRoute({ latitude: 0, longitude: 0 }, { latitude: 1, longitude: 1 }),
            ).rejects.toThrow('No route found');
        });
    });
});
