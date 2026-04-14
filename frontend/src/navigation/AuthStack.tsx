import { useMemo } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "@/types/navigation";
import { useThemeStore } from "@/stores/themeStore";
import { createHeaderScreenOptions } from "./navigation.styles";
import LoginScreen from "@/screens/Login/LoginScreen";
import RegisterScreen from "@/screens/Register/RegisterScreen";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthStack() {
  const colors = useThemeStore((s) => s.colors);
  const screenOptions = useMemo(() => createHeaderScreenOptions(colors), [colors]);

  return (
    <Stack.Navigator screenOptions={screenOptions} initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}
