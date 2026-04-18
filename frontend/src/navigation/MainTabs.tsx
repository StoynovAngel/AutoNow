import {useMemo} from "react";
import {View, Image, Pressable} from "react-native";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {useNavigation, CommonActions} from "@react-navigation/native";
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

function HeaderLogo() {
    const navigation = useNavigation();
    const handlePress = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{name: "HomeStack", state: {routes: [{name: "SelectService"}]}}],
            })
        );
    };
    return (
        <Pressable onPress={handlePress}>
            <Image source={require("../../assets/favicon.png")} style={{width: 36, height: 36}} />
        </Pressable>
    );
}

export default function MainTabs() {
    const colors = useThemeStore((s) => s.colors);
    const {t} = useTranslation();
    const headerOptions = useMemo(() => createHeaderScreenOptions(colors), [colors]);

    return (
        <Tab.Navigator
            screenOptions={{
                ...headerOptions,
                headerTitle: () => <HeaderLogo />,
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
