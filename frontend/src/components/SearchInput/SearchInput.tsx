import {useMemo} from "react";
import {View, TextInput} from "react-native";
import {useThemeStore} from "@/stores/themeStore";
import {createStyles} from "./SearchInput.styles";

type Props = {
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
};

export default function SearchInput({value, onChangeText, placeholder}: Props) {
    const colors = useThemeStore((s) => s.colors);
    const styles = useMemo(() => createStyles(colors), [colors]);

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor={colors.textDisabled}
                value={value}
                onChangeText={onChangeText}
                autoCorrect={false}
            />
        </View>
    );
}
