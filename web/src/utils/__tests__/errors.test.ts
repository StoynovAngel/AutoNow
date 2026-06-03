import { describe, it, expect } from 'vitest';
import { AxiosError, AxiosHeaders } from 'axios';
import { getErrorMessage } from '../errors';

const axiosError = (data: unknown): AxiosError => {
    const err = new AxiosError('boom');
    err.response = {
        data,
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config: { headers: new AxiosHeaders() },
    };
    return err;
};

describe('getErrorMessage', () => {
    it('returns the server message when present', () => {
        expect(getErrorMessage(axiosError({ message: 'Email already taken' }), 'fallback'))
            .toBe('Email already taken');
    });

    it('falls back when the AxiosError has no body message', () => {
        expect(getErrorMessage(axiosError({}), 'Default'))
            .toBe('Default');
    });

    it('falls back when the response body is not an object', () => {
        expect(getErrorMessage(axiosError('plain text body'), 'Default'))
            .toBe('Default');
    });

    it('falls back for non-axios errors', () => {
        expect(getErrorMessage(new Error('boom'), 'Default')).toBe('Default');
    });

    it('falls back for thrown non-Error values', () => {
        expect(getErrorMessage('string', 'Default')).toBe('Default');
        expect(getErrorMessage(undefined, 'Default')).toBe('Default');
    });

    it('falls back when message is empty string', () => {
        expect(getErrorMessage(axiosError({ message: '' }), 'Default')).toBe('Default');
    });
});
