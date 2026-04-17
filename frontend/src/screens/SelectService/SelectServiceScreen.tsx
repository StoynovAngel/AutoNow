import {useMemo} from "react";
import {View, Text} from "react-native";
import {useNavigation} from "@react-navigation/native";
import type {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {useThemeStore} from "@/stores/themeStore";
import {useTranslation} from "@/hooks/useTranslation";
import ScreenContainer from "@/components/ScreenContainer/ScreenContainer";
import GlassCard from "@/components/GlassCard/GlassCard";
import {createStyles} from "./SelectServiceScreen.styles";
import type {HomeStackParamList} from "@/types/navigation";
import type {CompanyType} from "@/types/api";

const SERVICE_TYPES: CompanyType[] = ["TAXI", "LOGISTICS", "AMBULANCE", "MOVING", "RENTAL"];

type NavigationProp = NativeStackNavigationProp<HomeStackParamList, "SelectService">;

export default function SelectServiceScreen() {
    const colors = useThemeStore((s) => s.colors);
    const {t} = useTranslation();
    const styles = useMemo(() => createStyles(colors), [colors]);
    const navigation = useNavigation<NavigationProp>();

    const handleSelect = (type: CompanyType) => {
        navigation.navigate("ServiceOptions", {serviceType: type});
    };

    return (
        <ScreenContainer>
            <View style={styles.wrapper}>
                <Text style={styles.title}>{t("home.selectService")}</Text>
                <View style={styles.grid}>
                    {SERVICE_TYPES.map((type) => (
                        <GlassCard
                            key={type}
                            onPress={() => handleSelect(type)}
                            style={styles.card}
                        >
                            <Text style={styles.cardText}>
                                {t(`home.serviceTypes.${type}`)}
                            </Text>
                        </GlassCard>
                    ))}
                </View>
            </View>
        </ScreenContainer>
    );
}
