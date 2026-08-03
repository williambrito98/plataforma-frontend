export type UserRole = {
  id: number;
  name: string;
  description?: string | null;
};

export type User = {
  id: string;
  name: string;
  email: string;
  profilePhotoUrl?: string | null;
  avatar?: string | null;
  createdAt?: string;
  updatedAt?: string;
  role?: UserRole;
  permissions?: string[];
};

export type ValidateTokenResponse = {
  valid: boolean;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  message: string;
};

export type LogoutResponse = {
  message: string;
};
