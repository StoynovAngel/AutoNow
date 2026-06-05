import { describe, it, expect } from 'vitest';
import { decodeJWT } from '../jwt';

const encodeSegment = (obj: unknown): string => {
    const json = JSON.stringify(obj);
    return btoa(unescape(encodeURIComponent(json)))
        .replace(/=+$/, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
};

const buildToken = (payload: unknown): string =>
    `${encodeSegment({ alg: 'HS256', typ: 'JWT' })}.${encodeSegment(payload)}.signature`;

describe('decodeJWT', () => {
    it('decodes a well-formed token with sub and authorities', () => {
        const token = buildToken({ sub: '42', authorities: ['ROLE_USER'] });

        const result = decodeJWT(token);

        expect(result).not.toBeNull();
        expect(result?.sub).toBe('42');
        expect(result?.authorities).toEqual(['ROLE_USER']);
    });

    it('preserves additional custom claims', () => {
        const token = buildToken({ sub: '7', authorities: ['A'], email: 'a@b.com' });

        expect(decodeJWT(token)?.email).toBe('a@b.com');
    });

    it('returns null when the token has fewer than 3 parts', () => {
        expect(decodeJWT('only.two')).toBeNull();
        expect(decodeJWT('one')).toBeNull();
    });

    it('returns null when the token has more than 3 parts', () => {
        expect(decodeJWT('a.b.c.d')).toBeNull();
    });

    it('returns null when the payload segment is not valid base64', () => {
        expect(decodeJWT('header.@@@.sig')).toBeNull();
    });

    it('returns null when the payload is not JSON', () => {
        const bogusPayload = btoa('not json').replace(/=+$/, '');
        expect(decodeJWT(`header.${bogusPayload}.sig`)).toBeNull();
    });

    it('returns null when sub is missing', () => {
        const token = buildToken({ authorities: ['ROLE_USER'] });
        expect(decodeJWT(token)).toBeNull();
    });

    it('returns null when sub is empty', () => {
        const token = buildToken({ sub: '', authorities: ['ROLE_USER'] });
        expect(decodeJWT(token)).toBeNull();
    });

    it('returns null when sub is not a string', () => {
        const token = buildToken({ sub: 42, authorities: ['ROLE_USER'] });
        expect(decodeJWT(token)).toBeNull();
    });

    it('returns null when authorities is missing', () => {
        const token = buildToken({ sub: '1' });
        expect(decodeJWT(token)).toBeNull();
    });

    it('returns null when authorities is not an array of strings', () => {
        expect(decodeJWT(buildToken({ sub: '1', authorities: 'ROLE_USER' }))).toBeNull();
        expect(decodeJWT(buildToken({ sub: '1', authorities: [1, 2] }))).toBeNull();
    });

    it('returns null when the payload is null or not an object', () => {
        const token = `header.${encodeSegment(null)}.sig`;
        expect(decodeJWT(token)).toBeNull();
    });

    it('preserves companyId when present as a number', () => {
        const token = buildToken({ sub: '1', authorities: ['ROLE_COMPANY_ADMIN'], companyId: 42 });
        expect(decodeJWT(token)?.companyId).toBe(42);
    });

    it('accepts companyId as null', () => {
        const token = buildToken({ sub: '1', authorities: ['ROLE_CUSTOMER'], companyId: null });
        expect(decodeJWT(token)?.companyId).toBeNull();
    });

    it('treats absent companyId as undefined', () => {
        const token = buildToken({ sub: '1', authorities: ['ROLE_CUSTOMER'] });
        expect(decodeJWT(token)?.companyId).toBeUndefined();
    });

    it('returns null when companyId is not a number', () => {
        expect(decodeJWT(buildToken({ sub: '1', authorities: ['A'], companyId: 'abc' }))).toBeNull();
        expect(decodeJWT(buildToken({ sub: '1', authorities: ['A'], companyId: true }))).toBeNull();
    });
});
