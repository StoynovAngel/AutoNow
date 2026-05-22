import { login, register, logout, getStoredToken, decodeToken } from './authService';
import customAPI from './ApiClient';
import storage from './storage';

jest.mock('./ApiClient', () => ({
    __esModule: true,
    default: { post: jest.fn() },
}));

const mockedPost = customAPI.post as jest.Mock;

const buildToken = (payload: Record<string, unknown>) => {
    const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');
    const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
    return `${header}.${body}.signature`;
};

describe('authService', () => {
    beforeEach(async () => {
        jest.clearAllMocks();
        await storage.deleteItem('jwt');
    });

    describe('decodeToken', () => {
        it('decodes a valid JWT payload', () => {
            const token = buildToken({ sub: 'a@b.com', id: 1, username: 'alice', roles: [{ authority: 'CUSTOMER' }] });
            expect(decodeToken(token)).toEqual({
                sub: 'a@b.com',
                id: 1,
                username: 'alice',
                roles: [{ authority: 'CUSTOMER' }],
            });
        });

        it('throws when the token is empty', () => {
            expect(() => decodeToken('')).toThrow(/token is empty/);
        });

        it('throws when the token does not have 3 segments', () => {
            expect(() => decodeToken('only.two')).toThrow(/3 segments/);
        });

        it('throws when the payload is not valid base64-encoded JSON', () => {
            expect(() => decodeToken('header.@@@notb64@@@.sig')).toThrow(/failed to decode/);
        });
    });

    describe('login', () => {
        it('POSTs credentials, stores the token, and returns the decoded payload', async () => {
            const token = buildToken({ sub: 'a@b.com', id: 1, username: 'alice', roles: [] });
            mockedPost.mockResolvedValue({ data: { token } });

            const result = await login('a@b.com', 'pw');

            expect(mockedPost).toHaveBeenCalledWith('api/auth/login', { email: 'a@b.com', password: 'pw' });
            expect(await storage.getItem('jwt')).toBe(token);
            expect(result).toMatchObject({ sub: 'a@b.com', id: 1 });
        });
    });

    describe('register', () => {
        it('POSTs with CUSTOMER role and returns the decoded payload', async () => {
            const token = buildToken({ sub: 'new@b.com', id: 2, username: 'new', roles: [] });
            mockedPost.mockResolvedValue({ data: { token } });

            const result = await register('new@b.com', 'pw');

            expect(mockedPost).toHaveBeenCalledWith('api/auth/register', {
                email: 'new@b.com',
                password: 'pw',
                roleNames: ['CUSTOMER'],
            });
            expect(await storage.getItem('jwt')).toBe(token);
            expect(result.sub).toBe('new@b.com');
        });
    });

    describe('logout', () => {
        it('removes the stored token', async () => {
            await storage.setItem('jwt', 'jwt-token');

            await logout();

            expect(await storage.getItem('jwt')).toBeNull();
        });
    });

    describe('getStoredToken', () => {
        it('returns the stored token', async () => {
            await storage.setItem('jwt', 'jwt-token');
            expect(await getStoredToken()).toBe('jwt-token');
        });

        it('returns null when nothing is stored', async () => {
            expect(await getStoredToken()).toBeNull();
        });
    });
});
