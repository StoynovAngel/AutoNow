import React from "react";
import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {View, Text, Pressable} from "react-native";
import {MaterialIcons} from "@expo/vector-icons";
import type {RootStackParamList} from "../../navigation/Navigation";
import styles from "./Header.style";

const Header = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    return (
        <View style={styles.header}>
            <View style={styles.userInfo}>
                <Text style={styles.username}>AutoNow</Text>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Pressable onPress={() => navigation.navigate("test")} style={styles.adminButton}>
                    <Text style={styles.adminButtonText}>Admin</Text>
                </Pressable>

                <Pressable style={styles.logoutButton}>
                    <MaterialIcons name="logout" color={"black"} size={24}/>
                </Pressable>
            </View>
        </View>
    );
};

export default Header;