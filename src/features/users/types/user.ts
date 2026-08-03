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

export function normalizeUserListItem(
  user: UserListItemApiResponse,
): UserListItem {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    profilePhotoUrl: user.profilePhotoUrl ?? null,
    role: user.role,
  };
}
