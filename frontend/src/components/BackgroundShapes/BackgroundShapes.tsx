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
  borderRadii: [number, number, number, number];
  opacity: number;
  scale?: [number, number];
};

const BLOBS: Blob[] = [
  { top: -80, left: -90, width: 220, height: 180, rotation: "-25deg", color: "#00E8C5", borderRadii: [70, 40, 80, 30], opacity: 0.7 },
  { top: -40, left: W - 120, width: 160, height: 200, rotation: "35deg", color: "#FF6B6B", borderRadii: [50, 80, 35, 65], opacity: 0.6 },
  { top: 0.4 * H, left: -70, width: 150, height: 170, rotation: "55deg", color: "#aa9cfe", borderRadii: [65, 45, 75, 35], opacity: 0.5 },
  { top: 0.6 * H, left: W - 80, width: 170, height: 150, rotation: "-40deg", color: "#FFB347", borderRadii: [40, 70, 50, 80], opacity: 0.55 },
  { top: 0.85 * H, left: -60, width: 180, height: 160, rotation: "20deg", color: "#FF8FA3", borderRadii: [75, 35, 60, 50], opacity: 0.5 },
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
            borderTopLeftRadius: (blob.borderRadii[0] / 100) * blob.width,
            borderTopRightRadius: (blob.borderRadii[1] / 100) * blob.height,
            borderBottomRightRadius: (blob.borderRadii[2] / 100) * blob.width,
            borderBottomLeftRadius: (blob.borderRadii[3] / 100) * blob.height,
            backgroundColor: blob.color,
            opacity: blob.opacity,
            transform: [
              { rotate: blob.rotation },
              { scaleX: blob.scale?.[0] ?? 1 },
              { scaleY: blob.scale?.[1] ?? 1 },
            ],
          }}
        />
      ))}
    </View>
  );
}
