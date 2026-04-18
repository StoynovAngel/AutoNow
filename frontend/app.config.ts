import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: config.name ?? "AutoNow",
  slug: config.slug ?? "autonow",
  android: {
    ...config.android,
    usesCleartextTraffic: true,
  },
  extra: {
    ...(process.env.API_URL ? { apiUrl: process.env.API_URL } : {}),
  },
});
