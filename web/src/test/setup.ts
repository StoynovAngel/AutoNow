import '@testing-library/jest-dom';

// jsdom 29 + vitest 4 only expose Storage on `window`, not on `globalThis`.
// Bare `localStorage`/`sessionStorage` references in tests need them as globals.
if (typeof window !== 'undefined') {
    if (typeof globalThis.localStorage === 'undefined' && window.localStorage) {
        Object.defineProperty(globalThis, 'localStorage', {
            value: window.localStorage,
            writable: true,
            configurable: true,
        });
    }
    if (typeof globalThis.sessionStorage === 'undefined' && window.sessionStorage) {
        Object.defineProperty(globalThis, 'sessionStorage', {
            value: window.sessionStorage,
            writable: true,
            configurable: true,
        });
    }
}
