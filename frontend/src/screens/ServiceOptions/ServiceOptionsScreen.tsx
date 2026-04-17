import {useMemo} from "react";
import {View, Text} from "react-native";
import {useNavigation, useRoute} from "@react-navigation/native";
import type {NativeStackNavigationProp} from "@react-navigation/native-stack";
import type {RouteProp} from "@react-navigation/native";
import {useThemeStore} from "@/stores/themeStore";
import {useTranslation} from "@/hooks/useTranslation";
import ScreenContainer from "@/components/ScreenContainer/ScreenContainer";
import GlassCard from "@/components/GlassCard/GlassCard";
import BackButton from "@/components/BackButton/BackButton";
import {createStyles} from "./ServiceOptionsScreen.styles";
import type {HomeStackParamList} from "@/types/navigation";

type NavigationProp = NativeStackNavigationProp<HomeStackParamList, "ServiceOptions">;
type ScreenRouteProp = RouteProp<HomeStackParamList, "ServiceOptions">;

export default function ServiceOptionsScreen() {
    const colors = useThemeStore((s) => s.colors);
    const {t} = useTranslation();
    const styles = useMemo(() => createStyles(colors), [colors]);
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<ScreenRouteProp>();
    const {serviceType} = route.params;

    const handleBrowseCompanies = () => {
        navigation.navigate("BrowseCompanies", {serviceType});
    };

    return (
        <ScreenContainer>
            <BackButton
                label={t(`home.serviceTypes.${serviceType}`)}
                onPress={() => navigation.goBack()}
            />
            <View style={styles.wrapper}>
                <Text style={styles.title}>{t("home.selectOption")}</Text>
                <View style={styles.container}>
                    <GlassCard onPress={handleBrowseCompanies} style={styles.card}>
                        <Text style={styles.cardTitle}>{t("home.browseCompanies")}</Text>
                        <Text style={styles.cardDescription}>{t("home.browseCompaniesDesc")}</Text>
                    </GlassCard>
                </View>
            </View>
        </ScreenContainer>
    );
}
