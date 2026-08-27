const { withStringsXml } = require('@expo/config-plugins');

module.exports = function withMapboxToken(config) {
    return withStringsXml(config, (mod) => {
        const token = process.env.EXPO_PUBLIC_MAPBOX_TOKEN ?? '';
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
