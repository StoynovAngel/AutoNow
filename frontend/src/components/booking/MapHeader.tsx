import React from 'react';
import { View, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { theme } from '../../constants/theme';
import type { RootStackParamList } from '../../navigation/Navigation';
import type { Coordinate, RouteResult } from '../../services/mapboxService';
import MapPreview from './MapPreview';
import { createStyles } from './MapHeader.style';

interface MapHeaderProps {
    pickup?: Coordinate;
    destination?: Coordinate;
    route?: RouteResult;
}

const MapHeader = ({ pickup, destination, route }: MapHeaderProps) => {
    
    const { t } = useTranslation();
    const styles = createStyles(theme);
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    return (
        <View style={styles.mapContainer}>
            <MapPreview pickup={pickup} destination={destination} route={route} />
            <Pressable
                style={styles.backFab}
                onPress={() => navigation.goBack()}
                testID="map-back"
                accessibilityRole="button"
                accessibilityLabel={t('back')}
            >
                <MaterialIcons name="arrow-back" size={24} color={theme.colors.textPrimary} />
            </Pressable>
        </View>
    );
};

export default MapHeader;
