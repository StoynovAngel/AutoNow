import {useMemo} from "react";
import {View, Image, Pressable} from "react-native";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {useNavigation} from "@react-navigation/native";
import type {NavigationProp} from "@react-navigation/native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import type {MainTabParamList} from "@/types/navigation";
import {useThemeStore} from "@/stores/themeStore";
import {useTranslation} from "@/hooks/useTranslation";
import AccessibilityMenu from "@/components/AccessibilityMenu/AccessibilityMenu";
import LogoutButton from "@/components/LogoutButton/LogoutButton";
import {createIslandHeaderStyles, mainContentStyles} from "./navigation.styles";
import HomeStack from "./HomeStack";

const Tab = createBottomTabNavigator<MainTabParamList>();


function HeaderLogo() {
    const navigation = useNavigation<NavigationProp<MainTabParamList>>();
    const colors = useThemeStore((s) => s.colors);
    const insets = useSafeAreaInsets();
    const styles = useMemo(() => createIslandHeaderStyles(colors, insets.top), [colors, insets.top]);

    const handlePress = () => {
        navigation.navigate("HomeStack", { screen: "SelectService" });
    };
    return (
        <Pressable
            onPress={handlePress}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Go to home"
        >
            <Image source={require("../../assets/favicon.png")} style={styles.logo}/>
        </Pressable>
    );
}

function IslandHeader() {
    const colors = useThemeStore((s) => s.colors);
    const insets = useSafeAreaInsets();
    const styles = useMemo(() => createIslandHeaderStyles(colors, insets.top), [colors, insets.top]);

    return (
        <View style={styles.wrapper}>
            <View style={styles.island}>
                <HeaderLogo/>
                <View style={styles.right}>
                    <AccessibilityMenu/>
                    <LogoutButton/>
                </View>
            </View>
        </View>
    );
}

function MainContent() {
    return (
        <View style={mainContentStyles.container}>
            <IslandHeader/>
            <HomeStack/>
        </View>
    );
}

export default function MainTabs() {
    const colors = useThemeStore((s) => s.colors);
    const {t} = useTranslation();

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {display: "none"},
                sceneStyle: {backgroundColor: colors.background},
            }}
        >
            <Tab.Screen
                name="HomeStack"
                component={MainContent}
                options={{tabBarLabel: t("home.tab")}}
            />
        </Tab.Navigator>
    );
}
