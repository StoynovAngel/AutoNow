import {useMemo, ReactNode} from "react";
import {View} from "react-native";
import {useThemeStore} from "@/stores/themeStore";
import BackgroundShapes from "@/components/BackgroundShapes/BackgroundShapes";
import {createStyles} from "./ScreenContainer.styles";

type Props = {
    children: ReactNode;
    centered?: boolean;
};

export default function ScreenContainer({children, centered}: Props) {
    const colors = useThemeStore((s) => s.colors);
    const showBlobs = useThemeStore((s) => s.showBlobs);
    const styles = useMemo(() => createStyles(colors), [colors]);

    return (
        <View style={[styles.container, centered && styles.centered]}>
            {showBlobs && <BackgroundShapes />}
            {children}
        </View>
    );
}
