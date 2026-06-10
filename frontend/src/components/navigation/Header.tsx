import React from "react";
import {View, Text, Pressable} from "react-native";
import {MaterialIcons} from "@expo/vector-icons";
import {createStyles} from "./Header.style";
import {useTheme} from "../../hooks/useTheme";
import {useAuth} from "../../hooks/useAuth";

const Header = () => {
    const {theme, toggleTheme, themeMode} = useTheme();
    const {logout} = useAuth();
    const styles = createStyles(theme);

    const handleLogout = async () => {
        await logout();
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.userInfo}>
                    <Text style={styles.username}>AutoNow</Text>
                </View>

                <View style={styles.actionsContainer}>
                    <Pressable onPress={toggleTheme} style={styles.logoutButton}>
                        <MaterialIcons
                            name={themeMode === 'dark' ? 'light-mode' : 'dark-mode'}
                            color={theme.colors.textPrimary}
                            size={24}
                        />
                    </Pressable>

                    <Pressable onPress={handleLogout} style={styles.logoutButton}>
                        <MaterialIcons name="logout" color={theme.colors.textPrimary} size={24}/>
                    </Pressable>
                </View>
            </View>
        </View>
    );
};

export default Header;