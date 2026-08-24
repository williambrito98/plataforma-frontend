export type CompanyThemeMode = Record<string, string>;

export type CompanyTheme = {
  light?: CompanyThemeMode;
  dark?: CompanyThemeMode;
};

export type CompanyBrandingValues = {
  theme: CompanyTheme | null;
  clearTheme: boolean;
  logoFile: File | null;
  removeLogo: boolean;
};

export const DEFAULT_COMPANY_BRANDING: CompanyBrandingValues = {
  theme: null,
  clearTheme: false,
  logoFile: null,
  removeLogo: false,
};
