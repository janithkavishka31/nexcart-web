export type UserRole = 'USER' | 'SELLER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  createdAt?: string;
}

export interface AuthPayload {
  user: User;
  accessToken: string;
}
