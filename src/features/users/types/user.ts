export type UserRoleSummary = {
  id: string;
  name: string;
  description?: string | null;
};

export type UserListItem = {
  id: string;
  name: string;
  email: string;
  profilePhotoUrl: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  role: UserRoleSummary | null;
};

export type UserListItemApiResponse = {
  id: string;
  name: string;
  email: string;
  profilePhotoUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
  role: UserRoleSummary | null;
};

export type CreateUserPayload = {
  name: string;
  email: string;
  password: string;
  roleId: string;
};

export type UpdateUserAdminPayload = {
  name?: string;
  email?: string;
  password?: string;
  roleId?: string | null;
};

export function normalizeUserListItem(
  user: UserListItemApiResponse,
): UserListItem {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    profilePhotoUrl: user.profilePhotoUrl ?? null,
    createdAt: user.createdAt ?? null,
    updatedAt: user.updatedAt ?? null,
    role: user.role,
  };
}
