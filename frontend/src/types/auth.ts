export type { UserRequestDTO, JwtResponse, Role, User } from '../../../shared/types/auth';

export type AuthContextType = {
    user: import('../../../shared/types/auth').User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
};
