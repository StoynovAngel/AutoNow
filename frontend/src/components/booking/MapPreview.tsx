/**
 * Native (iOS/Android) implementation of the map preview.
 * Display-only: renders pickup + destination markers and an optional route line.
 */
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import Mapbox, { MapView, Camera, ShapeSource, LineLayer, MarkerView } from '@rnmapbox/maps';
import { MAPBOX_TOKEN } from '../../config/mapbox';
import type { Coordinate, RouteResult } from '../../services/mapboxService';

Mapbox.setAccessToken(MAPBOX_TOKEN);

interface MapPreviewProps {
    pickup?: Coordinate;
    destination?: Coordinate;
    route?: RouteResult;
}

const SOFIA_CENTER: Coordinate = { latitude: 42.6977, longitude: 23.3219 };

const MapPreview = ({ pickup, destination, route }: MapPreviewProps) => {
    const cameraRef = useRef<Camera>(null);

    useEffect(() => {
        const cam = cameraRef.current;
        if (!cam) return;
        if (pickup && destination) {
            const minLng = Math.min(pickup.longitude, destination.longitude);
            const maxLng = Math.max(pickup.longitude, destination.longitude);
            const minLat = Math.min(pickup.latitude, destination.latitude);
            const maxLat = Math.max(pickup.latitude, destination.latitude);
            cam.fitBounds([maxLng, maxLat], [minLng, minLat], [80, 60, 220, 60], 500);
        } else if (pickup) {
            cam.setCamera({ centerCoordinate: [pickup.longitude, pickup.latitude], zoomLevel: 13, animationDuration: 400 });
        } else if (destination) {
            cam.setCamera({ centerCoordinate: [destination.longitude, destination.latitude], zoomLevel: 13, animationDuration: 400 });
        }
    }, [pickup, destination]);

    const initialCenter = pickup ?? SOFIA_CENTER;

    return (
        <View style={styles.container}>
            <MapView style={StyleSheet.absoluteFillObject}>
                <Camera
                    ref={cameraRef}
                    defaultSettings={{
                        centerCoordinate: [initialCenter.longitude, initialCenter.latitude],
                        zoomLevel: 12,
                    }}
                />
                {route && (
                    <ShapeSource id="route-source" shape={route.geometry}>
                        <LineLayer
                            id="route-line"
                            style={{
                                lineColor: '#FF6B00',
                                lineWidth: 4,
                                lineCap: 'round',
                                lineJoin: 'round',
                            }}
                        />
                    </ShapeSource>
                )}
                {pickup && (
                    <MarkerView coordinate={[pickup.longitude, pickup.latitude]}>
                        <View style={styles.pickupPin} />
                    </MarkerView>
                )}
                {destination && (
                    <MarkerView coordinate={[destination.longitude, destination.latitude]}>
                        <View style={styles.destinationPin} />
                    </MarkerView>
                )}
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#E5E7EB' },
    pickupPin: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#FF6B00',
        borderWidth: 3,
        borderColor: '#FFFFFF',
    },
    destinationPin: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#1F2937',
        borderWidth: 3,
        borderColor: '#FFFFFF',
    },
});

export default MapPreview;
