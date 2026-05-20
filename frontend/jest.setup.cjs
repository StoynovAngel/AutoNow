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
