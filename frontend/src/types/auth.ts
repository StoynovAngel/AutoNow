export interface UserRequestDTO {
  email: string;
  password: string;
}

export interface JwtResponse {
  token: string;
}

export type Role = {
    authority: string;
};

export type User = {
    id: number;
    username: string;
    sub: string;
    roles: Role[];
};

export type AuthContextType = {
    user: User | null;
    loading: boolean;
    login: ( ) => Promise<void>;
    register: ( ) => Promise<void>;
    logout: () => Promise<void>;
};
