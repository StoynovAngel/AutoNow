import axios from 'axios';

export const getErrorMessage = (err: unknown, fallback: string): string => {
    if (axios.isAxiosError(err)) {
        const message = (err.response?.data as { message?: unknown } | undefined)?.message;
        if (typeof message === 'string' && message.length > 0) {
            return message;
        }
    }
    return fallback;
};
