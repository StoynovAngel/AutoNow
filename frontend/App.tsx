import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useAuthState } from "@/hooks/useAuthState";
import { hydrateLocale } from "@/stores/localeStore";
import { hydrateTheme } from "@/stores/themeStore";
import { useThemeStore } from "@/stores/themeStore";
import RootNavigator from "@/navigation/RootNavigator";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1 } },
});

function AppContent() {
  useAuthState();

  useEffect(() => {
    hydrateLocale();
    hydrateTheme();
  }, []);

  return <RootNavigator />;
}

export default function App() {
  const mode = useThemeStore((s) => s.mode);

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <AppContent />
        <StatusBar style={mode === "dark" ? "light" : "dark"} />
      </NavigationContainer>
    </QueryClientProvider>
  );
}
