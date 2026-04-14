import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: config.name ?? "AutoNow",
  slug: config.slug ?? "autonow",
  extra: {
    apiUrl: process.env.API_URL ?? "http://10.0.2.2:8080",
  },
});
