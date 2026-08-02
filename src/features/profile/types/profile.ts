export type ProfileRole = {
  id: string;
  name: string;
  description: string | null;
};

export type ProfileUser = {
  id: string;
  name: string;
  email: string;
  company: string;
  avatar?: string;
  role?: ProfileRole;
  permissions: string[];
};
