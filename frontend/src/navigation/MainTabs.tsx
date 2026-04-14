import { useMemo } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { MainTabParamList } from "@/types/navigation";
import { useThemeStore } from "@/stores/themeStore";
import AccessibilityMenu from "@/components/AccessibilityMenu/AccessibilityMenu";
import { createHeaderScreenOptions, createTabBarStyles, createTabBarColors } from "./navigation.styles";
import HomeScreen from "@/screens/Home/HomeScreen";

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabs() {
  const colors = useThemeStore((s) => s.colors);
  const headerOptions = useMemo(() => createHeaderScreenOptions(colors), [colors]);
  const tabBarStyles = useMemo(() => createTabBarStyles(colors), [colors]);
  const tabBarColors = useMemo(() => createTabBarColors(colors), [colors]);

  return (
    <Tab.Navigator
      screenOptions={{
        ...headerOptions,
        headerRight: () => <AccessibilityMenu />,
        tabBarStyle: tabBarStyles.tabBar,
        tabBarActiveTintColor: tabBarColors.activeTintColor,
        tabBarInactiveTintColor: tabBarColors.inactiveTintColor,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: "Home" }}
      />
    </Tab.Navigator>
  );
}
