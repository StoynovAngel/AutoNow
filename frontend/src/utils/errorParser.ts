export const parseApiError = (err: unknown): string => {
    try {
        if (typeof err === 'object' && err !== null) {
            const e = err as Record<string, unknown>;
            const data = (e?.response as Record<string, unknown>)?.data as Record<string, unknown> | undefined;

            if (data?.errors && typeof data.errors === 'object' && data.errors !== null) {
                const errorMessages = Object.values(data.errors)
                    .filter(msg => typeof msg === 'string')
                    .join(', ');
                if (errorMessages) return errorMessages;
            }

            if (typeof data?.detail === 'string') return data.detail;

            if (typeof (e as { message?: unknown }).message === 'string') {
                return (e as { message: string }).message;
            }
        }
    } catch (parseError) {
        console.error('Error parsing API error:', parseError);
    }

    return 'An error occurred. Please try again.';
};
