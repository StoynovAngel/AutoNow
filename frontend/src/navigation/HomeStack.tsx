import {useMemo} from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {useThemeStore} from "@/stores/themeStore";
import {useTranslation} from "@/hooks/useTranslation";
import type {HomeStackParamList} from "@/types/navigation";
import SelectServiceScreen from "@/screens/SelectService/SelectServiceScreen";
import ServiceOptionsScreen from "@/screens/ServiceOptions/ServiceOptionsScreen";
import BrowseCompaniesScreen from "@/screens/BrowseCompanies/BrowseCompaniesScreen";

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStack() {
    const colors = useThemeStore((s) => s.colors);
    const {t} = useTranslation();

    const screenOptions = useMemo(() => ({
        headerShown: false,
        contentStyle: {backgroundColor: colors.background},
    }), [colors]);

    return (
        <Stack.Navigator screenOptions={screenOptions}>
            <Stack.Screen name="SelectService" component={SelectServiceScreen} />
            <Stack.Screen
                name="ServiceOptions"
                component={ServiceOptionsScreen}
                options={({route}) => ({
                    headerShown: true,
                    headerTitle: t(`home.serviceTypes.${route.params.serviceType}`),
                    headerStyle: {backgroundColor: colors.background},
                    headerTintColor: colors.primary,
                    headerShadowVisible: false,
                })}
            />
            <Stack.Screen
                name="BrowseCompanies"
                component={BrowseCompaniesScreen}
                options={({route}) => ({
                    headerShown: true,
                    headerTitle: t(`home.serviceTypes.${route.params.serviceType}`),
                    headerStyle: {backgroundColor: colors.background},
                    headerTintColor: colors.primary,
                    headerShadowVisible: false,
                })}
            />
        </Stack.Navigator>
    );
}
