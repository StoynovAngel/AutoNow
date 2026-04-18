import {useMemo, useState, useCallback} from "react";
import {Text, FlatList, ActivityIndicator} from "react-native";
import {useNavigation, useRoute} from "@react-navigation/native";
import type {NativeStackNavigationProp} from "@react-navigation/native-stack";
import type {RouteProp} from "@react-navigation/native";
import {useThemeStore} from "@/stores/themeStore";
import {useTranslation} from "@/hooks/useTranslation";
import {useCompanies} from "@/hooks/useCompanies";
import ScreenContainer from "@/components/ScreenContainer/ScreenContainer";
import SearchInput from "@/components/SearchInput/SearchInput";
import CompanyCard from "@/components/CompanyCard/CompanyCard";
import BackButton from "@/components/BackButton/BackButton";
import {createStyles} from "./BrowseCompaniesScreen.styles";
import type {HomeStackParamList} from "@/types/navigation";
import type {Company} from "@/types/api";

type NavigationProp = NativeStackNavigationProp<HomeStackParamList, "BrowseCompanies">;
type ScreenRouteProp = RouteProp<HomeStackParamList, "BrowseCompanies">;

export default function BrowseCompaniesScreen() {
    const colors = useThemeStore((s) => s.colors);
    const {t} = useTranslation();
    const styles = useMemo(() => createStyles(colors), [colors]);
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<ScreenRouteProp>();
    const {serviceType} = route.params;

    const {data: companies, isLoading, error} = useCompanies();
    const [search, setSearch] = useState("");

    const filtered = useMemo(() => {
        if (!companies) return [];
        const byType = companies.filter((c) => c.companyType === serviceType);
        if (!search.trim()) return byType;
        const query = search.trim().toLowerCase();
        return byType.filter((c) => c.name.toLowerCase().includes(query));
    }, [companies, serviceType, search]);

    const renderCompany = useCallback(
        ({item}: {item: Company}) => (
            <CompanyCard
                company={item}
                typeLabel={t(`home.serviceTypes.${item.companyType}`)}
            />
        ),
        [t],
    );

    const keyExtractor = useCallback((item: Company) => String(item.id), []);

    if (isLoading) {
        return (
            <ScreenContainer centered>
                <ActivityIndicator size="large" color={colors.primary} />
            </ScreenContainer>
        );
    }

    if (error) {
        return (
            <ScreenContainer centered>
                <Text style={styles.errorText}>{error.message}</Text>
            </ScreenContainer>
        );
    }

    const emptyMessage = search.trim() ? t("home.noResults") : t("home.noServices");

    return (
        <ScreenContainer>
            <BackButton
                label={t(`home.serviceTypes.${serviceType}`)}
                onPress={() => navigation.goBack()}
            />
            <SearchInput
                value={search}
                onChangeText={setSearch}
                placeholder={t("home.searchPlaceholder")}
            />
            <FlatList
                data={filtered}
                renderItem={renderCompany}
                keyExtractor={keyExtractor}
                contentContainerStyle={
                    filtered.length === 0
                        ? [styles.listContent, styles.centered]
                        : styles.listContent
                }
                ListEmptyComponent={<Text style={styles.emptyText}>{emptyMessage}</Text>}
            />
        </ScreenContainer>
    );
}
