export interface UserRequestDTO {
  email: string;
  password: string;
}

export interface JwtResponse {
  token: string;
}

export interface Role {
  authority: string;
}

export interface User {
  id: number;
  username: string;
  sub: string;
  roles: Role[];
}
