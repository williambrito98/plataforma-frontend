export type UserRole = {
  id: string;
  name: string;
  description?: string | null;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role?: UserRole;
  permissions?: string[];
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  user: User;
};
