import React from "react";
import {View, Text, Pressable} from "react-native";
import {MaterialIcons} from "@expo/vector-icons";
import {createStyles} from "./Header.style";
import {useTheme} from "../../hooks/useTheme";
import {useAuth} from "../../hooks/useAuth";

const Header = () => {
    const {theme} = useTheme();
    const {logout} = useAuth();
    const styles = createStyles(theme);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.userInfo}>
                    <Text style={styles.username}>AutoNow</Text>
                </View>

                <Pressable onPress={logout} style={styles.logoutButton}>
                    <MaterialIcons name="logout" color={theme.colors.textPrimary} size={24}/>
                </Pressable>
            </View>
        </View>
    );
};

export default Header;
