import {useMemo} from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {useThemeStore} from "@/stores/themeStore";
import type {HomeStackParamList} from "@/types/navigation";
import SelectServiceScreen from "@/screens/SelectService/SelectServiceScreen";
import ServiceOptionsScreen from "@/screens/ServiceOptions/ServiceOptionsScreen";
import BrowseCompaniesScreen from "@/screens/BrowseCompanies/BrowseCompaniesScreen";

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStack() {
    const colors = useThemeStore((s) => s.colors);

    const screenOptions = useMemo(() => ({
        headerShown: false,
        contentStyle: {backgroundColor: colors.background},
    }), [colors]);

    return (
        <Stack.Navigator screenOptions={screenOptions}>
            <Stack.Screen name="SelectService" component={SelectServiceScreen} />
            <Stack.Screen name="ServiceOptions" component={ServiceOptionsScreen} />
            <Stack.Screen name="BrowseCompanies" component={BrowseCompaniesScreen} />
        </Stack.Navigator>
    );
}
