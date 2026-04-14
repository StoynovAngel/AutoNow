import {useMemo, useState, useCallback} from "react";
import {View, Text, TextInput, FlatList, ActivityIndicator, Image} from "react-native";
import {useThemeStore} from "@/stores/themeStore";
import {useTranslation} from "@/hooks/useTranslation";
import {useCompanies} from "@/hooks/useCompanies";
import BackgroundShapes from "@/components/BackgroundShapes/BackgroundShapes";
import {createStyles} from "./HomeScreen.styles";
import type {Company} from "@/types/api";

export default function HomeScreen() {
    const colors = useThemeStore((s) => s.colors);
    const showBlobs = useThemeStore((s) => s.showBlobs);

    const {t} = useTranslation();
    const styles = useMemo(() => createStyles(colors), [colors]);
    const {data: companies, isLoading, error} = useCompanies();
    const [search, setSearch] = useState("");

    const filtered = useMemo(() => {
        if (!companies) return [];
        if (!search.trim()) return companies;
        const query = search.trim().toLowerCase();
        return companies.filter((c) => c.name.toLowerCase().includes(query));
    }, [companies, search]);

    const renderItem = useCallback(
        ({item}: { item: Company }) => (
            <View style={styles.card}>
                {item.logoUrl && (
                    <Image source={{uri: item.logoUrl}} style={styles.cardImage}/>
                )}
                <View style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardName} numberOfLines={1}>
                            {item.name}
                        </Text>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{item.companyType}</Text>
                        </View>
                    </View>
                    {item.description && (
                        <Text style={styles.cardDescription} numberOfLines={2}>
                            {item.description}
                        </Text>
                    )}
                    <Text style={styles.cardAddress} numberOfLines={1}>
                        {item.address}
                    </Text>
                </View>
            </View>
        ),
        [styles],
    );

    const keyExtractor = useCallback((item: Company) => String(item.id), []);

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={colors.primary}/>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>{error.message}</Text>
            </View>
        );
    }

    const emptyMessage =
        search.trim() ? t("home.noResults") : t("home.noServices");

    return (
        <View style={styles.container}>
            {showBlobs && <BackgroundShapes/>}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder={t("home.searchPlaceholder")}
                    placeholderTextColor={colors.textDisabled}
                    value={search}
                    onChangeText={setSearch}
                    autoCorrect={false}
                />
            </View>
            <FlatList
                data={filtered}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                contentContainerStyle={
                    filtered.length === 0
                        ? [styles.listContent, styles.centered]
                        : styles.listContent
                }
                ListEmptyComponent={<Text style={styles.emptyText}>{emptyMessage}</Text>}
            />
        </View>
    );
}
