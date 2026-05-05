export const parseApiError = (err: any): string => {
    try {
        if (err?.response?.data?.errors) {
            const errors = err.response.data.errors;
            if (typeof errors === 'object' && errors !== null) {
                const errorMessages = Object.values(errors)
                    .filter(msg => typeof msg === 'string')
                    .join(', ');
                if (errorMessages) {
                    return errorMessages;
                }
            }
        }

        if (err?.response?.data?.detail) {
            return String(err.response.data.detail);
        }

        if (err?.message) {
            return String(err.message);
        }
    } catch (parseError) {
        console.error('Error parsing API error:', parseError);
    }

    return 'An error occurred. Please try again.';
};
