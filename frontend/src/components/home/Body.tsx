import {View, Text, Pressable, ScrollView} from "react-native";
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import type {RootStackParamList} from "../../navigation/Navigation";
import {createStyles} from "./Body.style";
import {useTheme} from "../../hooks/useTheme";
import {getVehicleOptions} from "../../constants/vehicleOptions";
import {VehicleType} from "../../types/vehicle";
import {MaterialIcons} from "@expo/vector-icons";
import {useTranslation} from "react-i18next";

const Body = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const {theme} = useTheme();
    const {t} = useTranslation();
    const styles = createStyles(theme);
    const vehicleOptions = getVehicleOptions(t);

    const handleVehicleSelect = (type: VehicleType) => {
        navigation.navigate('companyList', { vehicleType: type });
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>{t("choose-service-title")}</Text>
                <Text style={styles.subtitle}>{t("select-service")}</Text>

                <View style={styles.vehicleGrid}>
                    {vehicleOptions.map((option) => (
                        <Pressable
                            key={option.type}
                            style={styles.vehicleCard}
                            onPress={() => handleVehicleSelect(option.type)}
                        >
                            <View style={[styles.iconContainer, {backgroundColor: option.color + '20'}]}>
                                <MaterialIcons
                                    name={option.icon as any}
                                    size={32}
                                    color={option.color}
                                />
                            </View>
                            <Text style={styles.vehicleLabel}>{option.label}</Text>
                            <Text style={styles.vehicleDescription}>{option.description}</Text>
                        </Pressable>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}

export default Body;