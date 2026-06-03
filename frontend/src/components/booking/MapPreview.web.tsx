/**
 * Web implementation of the map preview, using mapbox-gl directly.
 * Display-only: renders pickup + destination markers and an optional route line.
 */
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import mapboxgl from 'mapbox-gl';
import { MAPBOX_TOKEN } from '../../config/mapbox';
import type { Coordinate, RouteResult } from '../../services/mapboxService';

mapboxgl.accessToken = MAPBOX_TOKEN;

interface MapPreviewProps {
    pickup?: Coordinate;
    destination?: Coordinate;
    route?: RouteResult;
}

const ROUTE_SOURCE = 'route-source';
const ROUTE_LAYER = 'route-line';

const SOFIA_CENTER: Coordinate = { latitude: 42.6977, longitude: 23.3219 };

const MapPreview = ({ pickup, destination, route }: MapPreviewProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const pickupMarkerRef = useRef<mapboxgl.Marker | null>(null);
    const destinationMarkerRef = useRef<mapboxgl.Marker | null>(null);

    useEffect(() => {
        if (!containerRef.current || mapRef.current) return;
        const center = pickup ?? SOFIA_CENTER;
        mapRef.current = new mapboxgl.Map({
            container: containerRef.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [center.longitude, center.latitude],
            zoom: 12,
        });
        return () => {
            mapRef.current?.remove();
            mapRef.current = null;
        };
    }, []);

    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;

        if (pickup) {
            if (!pickupMarkerRef.current) {
                const el = document.createElement('div');
                el.style.width = '20px';
                el.style.height = '20px';
                el.style.borderRadius = '10px';
                el.style.background = '#FF6B00';
                el.style.border = '3px solid #FFFFFF';
                pickupMarkerRef.current = new mapboxgl.Marker({ element: el })
                    .setLngLat([pickup.longitude, pickup.latitude])
                    .addTo(map);
            } else {
                pickupMarkerRef.current.setLngLat([pickup.longitude, pickup.latitude]);
            }
        } else if (pickupMarkerRef.current) {
            pickupMarkerRef.current.remove();
            pickupMarkerRef.current = null;
        }

        if (destination) {
            if (!destinationMarkerRef.current) {
                const el = document.createElement('div');
                el.style.width = '20px';
                el.style.height = '20px';
                el.style.borderRadius = '10px';
                el.style.background = '#1F2937';
                el.style.border = '3px solid #FFFFFF';
                destinationMarkerRef.current = new mapboxgl.Marker({ element: el })
                    .setLngLat([destination.longitude, destination.latitude])
                    .addTo(map);
            } else {
                destinationMarkerRef.current.setLngLat([destination.longitude, destination.latitude]);
            }
        } else if (destinationMarkerRef.current) {
            destinationMarkerRef.current.remove();
            destinationMarkerRef.current = null;
        }

        if (pickup && destination) {
            const bounds = new mapboxgl.LngLatBounds()
                .extend([pickup.longitude, pickup.latitude])
                .extend([destination.longitude, destination.latitude]);
            map.fitBounds(bounds, { padding: { top: 80, right: 60, bottom: 220, left: 60 }, duration: 500 });
        } else if (pickup) {
            map.easeTo({ center: [pickup.longitude, pickup.latitude], duration: 400 });
        } else if (destination) {
            map.easeTo({ center: [destination.longitude, destination.latitude], duration: 400 });
        }
    }, [pickup, destination]);

    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;

        const apply = () => {
            if (route) {
                const data: GeoJSON.Feature<GeoJSON.LineString> = {
                    type: 'Feature',
                    properties: {},
                    geometry: route.geometry,
                };
                const existing = map.getSource(ROUTE_SOURCE) as mapboxgl.GeoJSONSource | undefined;
                if (existing) {
                    existing.setData(data);
                } else {
                    map.addSource(ROUTE_SOURCE, { type: 'geojson', data });
                    map.addLayer({
                        id: ROUTE_LAYER,
                        type: 'line',
                        source: ROUTE_SOURCE,
                        layout: { 'line-cap': 'round', 'line-join': 'round' },
                        paint: { 'line-color': '#FF6B00', 'line-width': 4 },
                    });
                }
            } else {
                if (map.getLayer(ROUTE_LAYER)) map.removeLayer(ROUTE_LAYER);
                if (map.getSource(ROUTE_SOURCE)) map.removeSource(ROUTE_SOURCE);
            }
        };

        if (map.isStyleLoaded()) apply();
        else map.once('load', apply);
    }, [route]);

    return (
        <View style={styles.container}>
            <div ref={containerRef} style={webStyles.mapDiv} />
        </View>
    );
};

const webStyles = {
    mapDiv: { position: 'absolute' as const, inset: 0 as unknown as number, width: '100%', height: '100%' },
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#E5E7EB', position: 'relative' },
});

export default MapPreview;
