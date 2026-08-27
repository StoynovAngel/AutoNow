const { withMainApplication, withStringsXml } = require('@expo/config-plugins');

// Inject mapbox_access_token into strings.xml (read by Mapbox Android SDK on startup)
// Token comes from EXPO_PUBLIC_MAPBOX_TOKEN env var at EAS build time (plaintext visibility)
const withMapboxTokenStrings = (config) => {
    return withStringsXml(config, (mod) => {
        const token = process.env.EXPO_PUBLIC_MAPBOX_TOKEN ?? '';
        if (!token.startsWith('pk.')) {
            throw new Error(
                'withMapboxToken: EXPO_PUBLIC_MAPBOX_TOKEN is missing or invalid at build time. ' +
                'Set it as an EAS environment variable (eas env:create) for this build profile, ' +
                'or export it locally before prebuild. Building without it bakes an empty ' +
                'mapbox_access_token and crashes with MapboxConfigurationException at runtime.',
            );
        }
        mod.modResults.resources.string = mod.modResults.resources.string ?? [];
        const existing = mod.modResults.resources.string.find(
            (s) => s.$.name === 'mapbox_access_token',
        );
        if (existing) {
            existing._ = token;
        } else {
            mod.modResults.resources.string.push({
                $: { name: 'mapbox_access_token', translatable: 'false' },
                _: token,
            });
        }
        return mod;
    });
};

// Also patch MainApplication.kt to set MapboxOptions.accessToken programmatically
// This is a belt-and-suspenders fallback in case strings.xml injection fails
const withMapboxTokenMainApplication = (config) => {
    return withMainApplication(config, (mod) => {
        const token = process.env.EXPO_PUBLIC_MAPBOX_TOKEN ?? '';
        if (!token) return mod;

        let contents = mod.modResults.contents;

        // Add import if not already present
        if (!contents.includes('com.mapbox.maps.MapboxOptions')) {
            contents = contents.replace(
                'import expo.modules.ApplicationLifecycleDispatcher',
                'import com.mapbox.maps.MapboxOptions\nimport expo.modules.ApplicationLifecycleDispatcher',
            );
        }

        // Add setAccessToken call in onCreate if not already present
        if (!contents.includes('MapboxOptions.accessToken')) {
            contents = contents.replace(
                'ApplicationLifecycleDispatcher.onApplicationCreate(this)',
                `MapboxOptions.accessToken = "${token}"\n    ApplicationLifecycleDispatcher.onApplicationCreate(this)`,
            );
        }

        mod.modResults.contents = contents;
        return mod;
    });
};

module.exports = (config) => {
    config = withMapboxTokenStrings(config);
    config = withMapboxTokenMainApplication(config);
    return config;
};
