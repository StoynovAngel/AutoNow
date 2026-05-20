jest.mock('expo-constants', () => ({
    __esModule: true,
    default: {
        expoConfig: { extra: { apiUrl: 'http://test-host' } },
    },
}));

jest.mock('expo-secure-store', () => {
    const memory = new Map();
    return {
        setItemAsync: jest.fn(async (key, value) => {
            memory.set(key, value);
        }),
        getItemAsync: jest.fn(async (key) => (memory.has(key) ? memory.get(key) : null)),
        deleteItemAsync: jest.fn(async (key) => {
            memory.delete(key);
        }),
        __memory: memory,
    };
});

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key, options) => {
            if (!options) return key;
            return Object.keys(options).reduce(
                (acc, k) => acc.replaceAll(`{{${k}}}`, String(options[k])),
                key,
            );
        },
        i18n: { language: 'en', changeLanguage: jest.fn() },
    }),
    initReactI18next: { type: '3rdParty', init: jest.fn() },
    Trans: ({ children }) => children,
}));

jest.mock('@expo/vector-icons', () => {
    const React = require('react');
    const { Text } = require('react-native');
    const Icon = ({ name }) => React.createElement(Text, { testID: `icon-${name}` }, name);
    return new Proxy(
        {},
        {
            get: () => Icon,
        },
    );
});
