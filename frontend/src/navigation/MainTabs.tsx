import {useMemo} from "react";
import {View, Image} from "react-native";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import type {MainTabParamList} from "@/types/navigation";
import {useThemeStore} from "@/stores/themeStore";
import {useTranslation} from "@/hooks/useTranslation";
import AccessibilityMenu from "@/components/AccessibilityMenu/AccessibilityMenu";
import LogoutButton from "@/components/LogoutButton/LogoutButton";
import {createHeaderScreenOptions, createHeaderTitleStyle} from "./navigation.styles";
import HomeStack from "./HomeStack";

const Tab = createBottomTabNavigator<MainTabParamList>();

function HeaderRight() {
    return (
        <View style={{flexDirection: "row", alignItems: "center"}}>
            <AccessibilityMenu/>
            <LogoutButton/>
        </View>
    );
}

export default function MainTabs() {
    const colors = useThemeStore((s) => s.colors);
    const {t} = useTranslation();
    const headerOptions = useMemo(() => createHeaderScreenOptions(colors), [colors]);
    const headerTitleStyle = useMemo(() => createHeaderTitleStyle(colors), [colors]);

    return (
        <Tab.Navigator
            screenOptions={{
                ...headerOptions,
                headerTitle: () => <Image source={require("../../assets/favicon.png")} style={{width: 36, height: 36}} />,
                headerTitleStyle: headerTitleStyle,
                headerLeft: () => null,
                headerRight: () => <HeaderRight/>,
                headerRightContainerStyle: {marginRight: 0, paddingRight: 0},
                tabBarStyle: {display: "none"},
            }}
        >
            <Tab.Screen
                name="HomeStack"
                component={HomeStack}
                options={{tabBarLabel: t("home.tab")}}
            />
        </Tab.Navigator>
    );
}
