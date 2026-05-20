import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach } from 'vitest';
import { cleanup } from '@testing-library/react';

const createStorage = (): Storage => {
    let store: Record<string, string> = {};
    return {
        get length() {
            return Object.keys(store).length;
        },
        clear: () => {
            store = {};
        },
        getItem: (key: string) => (key in store ? store[key] : null),
        setItem: (key: string, value: string) => {
            store[key] = String(value);
        },
        removeItem: (key: string) => {
            delete store[key];
        },
        key: (index: number) => Object.keys(store)[index] ?? null,
    };
};

if (typeof globalThis.localStorage === 'undefined') {
    Object.defineProperty(globalThis, 'localStorage', {
        configurable: true,
        value: createStorage(),
    });
}

beforeEach(() => {
    globalThis.localStorage.clear();
});

afterEach(() => {
    cleanup();
});
