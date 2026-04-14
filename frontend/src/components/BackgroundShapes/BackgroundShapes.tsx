import { View, Dimensions } from "react-native";
import { useThemeStore } from "@/stores/themeStore";
import { styles } from "./BackgroundShapes.styles";

const { width: W, height: H } = Dimensions.get("window");

type Blob = {
  top: number;
  left: number;
  width: number;
  height: number;
  rotation: string;
  color: string;
};

const BLOBS: Blob[] = [
  { top: -60, left: -70, width: 200, height: 160, rotation: "-15deg", color: "#00E8C5" },
  { top: 0.35 * H, left: W - 70, width: 180, height: 140, rotation: "20deg", color: "#FF6B6B" },
  { top: 0.65 * H, left: -80, width: 190, height: 170, rotation: "10deg", color: "#aa9cfe" },
  { top: 0.9 * H, left: W - 60, width: 170, height: 190, rotation: "-25deg", color: "#FFB347" },
];

export default function BackgroundShapes() {
  useThemeStore((s) => s.colors);

  return (
    <View style={styles.container} pointerEvents="none">
      {BLOBS.map((blob, i) => (
        <View
          key={i}
          style={{
            position: "absolute",
            top: blob.top,
            left: blob.left,
            width: blob.width,
            height: blob.height,
            borderRadius: Math.max(blob.width, blob.height) / 2,
            backgroundColor: blob.color,
            transform: [{ rotate: blob.rotation }],
          }}
        />
      ))}
    </View>
  );
}
