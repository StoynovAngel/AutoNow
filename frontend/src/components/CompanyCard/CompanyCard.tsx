import {useMemo} from "react";
import {View, Text, Image} from "react-native";
import {useThemeStore} from "@/stores/themeStore";
import {createStyles} from "./CompanyCard.styles";
import type {Company} from "@/types/api";

type Props = {
    company: Company;
    typeLabel: string;
};

export default function CompanyCard({company, typeLabel}: Props) {
    const colors = useThemeStore((s) => s.colors);
    const styles = useMemo(() => createStyles(colors), [colors]);

    return (
        <View style={styles.card}>
            {company.logoUrl && (
                <Image source={{uri: company.logoUrl}} style={styles.image} />
            )}
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.name} numberOfLines={1}>
                        {company.name}
                    </Text>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{typeLabel}</Text>
                    </View>
                </View>
                {company.description && (
                    <Text style={styles.description} numberOfLines={2}>
                        {company.description}
                    </Text>
                )}
                <Text style={styles.address} numberOfLines={1}>
                    {company.address}
                </Text>
            </View>
        </View>
    );
}
