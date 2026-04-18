import type { ReactNode} from "react";
import {useMemo, useState} from "react";
import type { StyleProp, ViewStyle} from "react-native";
import {View, TouchableOpacity} from "react-native";
import {useThemeStore} from "@/stores/themeStore";
import {createStyles} from "./GlassCard.styles";

type Props = {
    children: ReactNode;
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
    pressedStyle?: StyleProp<ViewStyle>;
};

export default function GlassCard({children, onPress, style, pressedStyle}: Props) {
    const colors = useThemeStore((s) => s.colors);
    const styles = useMemo(() => createStyles(colors), [colors]);
    const [pressed, setPressed] = useState(false);

    if (onPress) {
        return (
            <TouchableOpacity
                style={[styles.card, style, pressed && styles.cardPressed, pressed && pressedStyle]}
                onPress={onPress}
                onPressIn={() => setPressed(true)}
                onPressOut={() => setPressed(false)}
                activeOpacity={1}
            >
                {children}
            </TouchableOpacity>
        );
    }

    return <View style={[styles.card, style]}>{children}</View>;
}
