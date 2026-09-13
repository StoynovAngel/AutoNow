import React from 'react';
import { render } from '@testing-library/react-native';
import MapPreview from '../MapPreview';

const pickup = { latitude: 42.69, longitude: 23.32 };
const destination = { latitude: 42.71, longitude: 23.35 };
const route = {
    distanceKm: 5,
    durationMinutes: 12,
    geometry: { type: 'LineString' as const, coordinates: [[23.32, 42.69], [23.35, 42.71]] },
};

const mockMapView = jest.fn(({ children }) => <>{children}</>);
const mockCamera = jest.fn(() => null);
const mockShapeSource = jest.fn(({ children }) => <>{children}</>);
const mockLineLayer = jest.fn(() => null);
const mockMarkerView = jest.fn(({ children }) => <>{children}</>);

jest.mock('@rnmapbox/maps', () => ({
    __esModule: true,
    default: { setAccessToken: jest.fn() },
    MapView: (props: object) => mockMapView(props),
    Camera: (props: object) => mockCamera(props),
    ShapeSource: (props: object) => mockShapeSource(props),
    LineLayer: (props: object) => mockLineLayer(props),
    MarkerView: (props: object) => mockMarkerView(props),
    PointAnnotation: jest.fn(() => null),
}));

beforeEach(() => {
    jest.clearAllMocks();
});

describe('MapPreview', () => {
    it('renders MapView', () => {
        render(<MapPreview />);
        expect(mockMapView).toHaveBeenCalled();
    });

    it('shows no markers without props', () => {
        render(<MapPreview />);
        expect(mockMarkerView).not.toHaveBeenCalled();
    });

    it('shows one marker with only pickup', () => {
        render(<MapPreview pickup={pickup} />);
        expect(mockMarkerView).toHaveBeenCalledTimes(1);
        expect(mockMarkerView).toHaveBeenCalledWith(
            expect.objectContaining({ coordinate: [pickup.longitude, pickup.latitude] }),
        );
    });

    it('shows one marker with only destination', () => {
        render(<MapPreview destination={destination} />);
        expect(mockMarkerView).toHaveBeenCalledTimes(1);
        expect(mockMarkerView).toHaveBeenCalledWith(
            expect.objectContaining({ coordinate: [destination.longitude, destination.latitude] }),
        );
    });

    it('shows two markers when both provided', () => {
        render(<MapPreview pickup={pickup} destination={destination} />);
        expect(mockMarkerView).toHaveBeenCalledTimes(2);
    });

    it('renders ShapeSource and LineLayer when route provided', () => {
        render(<MapPreview pickup={pickup} destination={destination} route={route} />);
        expect(mockShapeSource).toHaveBeenCalledWith(
            expect.objectContaining({ id: 'route-source', shape: route.geometry }),
        );
        expect(mockLineLayer).toHaveBeenCalledWith(
            expect.objectContaining({ id: 'route-line' }),
        );
    });

    it('renders no route line without route', () => {
        render(<MapPreview pickup={pickup} destination={destination} />);
        expect(mockShapeSource).not.toHaveBeenCalled();
        expect(mockLineLayer).not.toHaveBeenCalled();
    });
});
