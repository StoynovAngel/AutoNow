import React from "react";
import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {View, Text, Pressable} from "react-native";
import {MaterialIcons} from "@expo/vector-icons";
import type {RootStackParamList} from "../../navigation/Navigation";
import { createStyles } from "./Header.style";
import { useTheme } from "../../hooks/useTheme";

const Header = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { theme, toggleTheme, themeMode } = useTheme();
    const styles = createStyles(theme);

    return (
        <View style={styles.header}>
            <View style={styles.userInfo}>
                <Text style={styles.username}>AutoNow</Text>
            </View>

            <View style={styles.buttonContainer}>
                <Pressable onPress={toggleTheme} style={styles.logoutButton}>
                    <MaterialIcons
                        name={themeMode === 'dark' ? 'light-mode' : 'dark-mode'}
                        color={theme.colors.textPrimary}
                        size={24}
                    />
                </Pressable>

                <Pressable onPress={() => navigation.navigate("test")} style={styles.adminButton}>
                    <Text style={styles.adminButtonText}>Admin</Text>
                </Pressable>

                <Pressable style={styles.logoutButton}>
                    <MaterialIcons name="logout" color={theme.colors.textPrimary} size={24}/>
                </Pressable>
            </View>
        </View>
    );
};

export default Header;