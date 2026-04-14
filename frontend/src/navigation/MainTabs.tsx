import { useMemo } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { MainTabParamList } from "@/types/navigation";
import { useThemeStore } from "@/stores/themeStore";
import { useTranslation } from "@/hooks/useTranslation";
import AccessibilityMenu from "@/components/AccessibilityMenu/AccessibilityMenu";
import { createHeaderScreenOptions, createTabBarStyles, createTabBarColors, createHeaderTitleStyle } from "./navigation.styles";
import HomeScreen from "@/screens/Home/HomeScreen";

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabs() {
  const colors = useThemeStore((s) => s.colors);
  const { t } = useTranslation();
  const headerOptions = useMemo(() => createHeaderScreenOptions(colors), [colors]);
  const headerTitleStyle = useMemo(() => createHeaderTitleStyle(colors), [colors]);
  const tabBarStyles = useMemo(() => createTabBarStyles(colors), [colors]);
  const tabBarColors = useMemo(() => createTabBarColors(colors), [colors]);

  return (
    <Tab.Navigator
      screenOptions={{
        ...headerOptions,
        headerTitle: "AutoNow",
        headerTitleStyle: headerTitleStyle,
        headerLeft: () => null,
        headerRight: () => <AccessibilityMenu />,
        headerRightContainerStyle: { marginRight: 0, paddingRight: 0 },
        tabBarStyle: { display: "none" },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: t("home.tab") }}
      />
    </Tab.Navigator>
  );
}
