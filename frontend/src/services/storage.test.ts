import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import storage from './storage';

const originalOS = Platform.OS;
const setOS = (os: typeof Platform.OS) => {
    // Platform.OS is read-only in types but is just a property at runtime.
    Object.defineProperty(Platform, 'OS', { configurable: true, value: os });
};

describe('storage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        setOS(originalOS);
    });

    describe('on web', () => {
        let memory: Record<string, string>;
        const originalLocalStorage = (global as unknown as { localStorage?: Storage }).localStorage;

        beforeEach(() => {
            setOS('web');
            memory = {};
            const fake: Storage = {
                length: 0,
                clear: () => { memory = {}; },
                getItem: (k) => (k in memory ? memory[k] : null),
                setItem: (k, v) => { memory[k] = v; },
                removeItem: (k) => { delete memory[k]; },
                key: (i) => Object.keys(memory)[i] ?? null,
            };
            Object.defineProperty(global, 'localStorage', { configurable: true, value: fake });
        });

        afterAll(() => {
            if (originalLocalStorage) {
                Object.defineProperty(global, 'localStorage', { configurable: true, value: originalLocalStorage });
            }
        });

        it('setItem writes to localStorage and skips SecureStore', async () => {
            await storage.setItem('jwt', 'tok');
            expect(memory.jwt).toBe('tok');
            expect(SecureStore.setItemAsync).not.toHaveBeenCalled();
        });

        it('getItem reads from localStorage', async () => {
            memory.jwt = 'tok';
            expect(await storage.getItem('jwt')).toBe('tok');
            expect(SecureStore.getItemAsync).not.toHaveBeenCalled();
        });

        it('getItem returns null when the key is missing', async () => {
            expect(await storage.getItem('nope')).toBeNull();
        });

        it('deleteItem removes from localStorage', async () => {
            memory.jwt = 'tok';
            await storage.deleteItem('jwt');
            expect(memory.jwt).toBeUndefined();
            expect(SecureStore.deleteItemAsync).not.toHaveBeenCalled();
        });
    });

    describe('on native (ios)', () => {
        beforeEach(() => {
            setOS('ios');
        });

        it('setItem delegates to SecureStore.setItemAsync', async () => {
            await storage.setItem('jwt', 'tok');
            expect(SecureStore.setItemAsync).toHaveBeenCalledWith('jwt', 'tok');
        });

        it('getItem delegates to SecureStore.getItemAsync', async () => {
            (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce('tok');
            expect(await storage.getItem('jwt')).toBe('tok');
            expect(SecureStore.getItemAsync).toHaveBeenCalledWith('jwt');
        });

        it('deleteItem delegates to SecureStore.deleteItemAsync', async () => {
            await storage.deleteItem('jwt');
            expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('jwt');
        });
    });
});
