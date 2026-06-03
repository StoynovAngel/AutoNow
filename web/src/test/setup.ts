import '@testing-library/jest-dom';

// jsdom 29 + vitest 4 don't reliably attach Storage to window/globalThis on
// every platform. Tests that reference bare `localStorage`/`sessionStorage`
// crash when it's missing. Provide a minimal in-memory Storage shim when the
// environment hasn't supplied one, so behaviour matches a browser.
const createStorage = (): Storage => {
    let store: Record<string, string> = {};
    return {
        get length() {
            return Object.keys(store).length;
        },
        clear() {
            store = {};
        },
        getItem(key: string) {
            return key in store ? store[key] : null;
        },
        key(index: number) {
            return Object.keys(store)[index] ?? null;
        },
        removeItem(key: string) {
            delete store[key];
        },
        setItem(key: string, value: string) {
            store[key] = String(value);
        },
    };
};

const ensureStorage = (name: 'localStorage' | 'sessionStorage'): void => {
    if (typeof globalThis[name] !== 'undefined') return;
    const storage = createStorage();
    Object.defineProperty(globalThis, name, {
        value: storage,
        writable: true,
        configurable: true,
    });
    if (typeof window !== 'undefined' && typeof window[name] === 'undefined') {
        Object.defineProperty(window, name, {
            value: storage,
            writable: true,
            configurable: true,
        });
    }
};

ensureStorage('localStorage');
ensureStorage('sessionStorage');
