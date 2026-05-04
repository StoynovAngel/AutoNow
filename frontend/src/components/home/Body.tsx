import {Button} from "react-native-paper";
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import type {RootStackParamList} from "../../navigation/Navigation";
import {View} from "react-native";
import {createStyles} from "./Body.style";
import {useTheme} from "../../hooks/useTheme";

const Body = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const {theme} = useTheme();
    const styles = createStyles(theme);

    return (
        <>
            <View style={styles.container}>
                <Button mode="contained" onPress={() => navigation.navigate("register")}>
                    Register
                </Button>
            </View>
        </>
    );
}

export default Body;