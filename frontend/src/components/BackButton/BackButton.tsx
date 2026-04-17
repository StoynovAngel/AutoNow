import {useMemo} from "react";
import {TouchableOpacity, Text} from "react-native";
import {useThemeStore} from "@/stores/themeStore";
import {createStyles} from "./BackButton.styles";

type Props = {
    label: string;
    onPress: () => void;
};

export default function BackButton({label, onPress}: Props) {
    const colors = useThemeStore((s) => s.colors);
    const styles = useMemo(() => createStyles(colors), [colors]);

    return (
        <TouchableOpacity onPress={onPress} style={styles.button}>
            <Text style={styles.text}>{"<"} {label}</Text>
        </TouchableOpacity>
    );
}
