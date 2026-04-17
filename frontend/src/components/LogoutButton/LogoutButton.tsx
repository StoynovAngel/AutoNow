import {useMemo} from "react";
import {TouchableOpacity} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {useThemeStore} from "@/stores/themeStore";
import {useAuthStore} from "@/stores/authStore";
import {createStyles} from "./LogoutButton.styles";

export default function LogoutButton() {
    const colors = useThemeStore((s) => s.colors);
    const clearAuth = useAuthStore((s) => s.clearAuth);
    const styles = useMemo(() => createStyles(colors), [colors]);

    return (
        <TouchableOpacity onPress={clearAuth} style={styles.button}>
            <Ionicons name="log-out-outline" size={20} color={colors.white} />
        </TouchableOpacity>
    );
}
