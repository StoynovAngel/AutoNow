export interface UserRequestDTO {
  email: string;
  password: string;
}

export interface JwtResponse {
  token: string;
}

export interface User {
  email: string;
  token: string;
}
