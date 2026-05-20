/** @type {import('jest').Config} */
module.exports = {
    preset: 'jest-expo',
    setupFiles: ['<rootDir>/jest.setup.cjs'],
    testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
    transformIgnorePatterns: [
        'node_modules/(?!((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|@sentry/.*))',
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
};
