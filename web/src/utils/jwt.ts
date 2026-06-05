export interface JwtPayload {
    sub: string;
    authorities: string[];
    companyId?: number | null;
    [claim: string]: unknown;
}

const isStringArray = (value: unknown): value is string[] =>
    Array.isArray(value) && value.every((item) => typeof item === 'string');

export const decodeJWT = (token: string): JwtPayload | null => {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );

        const parsed: unknown = JSON.parse(jsonPayload);
        if (!parsed || typeof parsed !== 'object') return null;

        const candidate = parsed as Record<string, unknown>;
        if (typeof candidate.sub !== 'string' || candidate.sub.length === 0) return null;
        if (!isStringArray(candidate.authorities)) return null;
        if (
            candidate.companyId !== undefined &&
            candidate.companyId !== null &&
            typeof candidate.companyId !== 'number'
        ) {
            return null;
        }

        return candidate as unknown as JwtPayload;
    } catch {
        return null;
    }
};
