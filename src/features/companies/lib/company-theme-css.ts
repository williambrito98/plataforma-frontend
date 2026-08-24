import type { CompanyTheme } from "@/features/companies/types/company-theme";

export function hasCompanyThemeContent(
  theme: CompanyTheme | null | undefined,
): boolean {
  if (!theme) {
    return false;
  }

  const lightCount = theme.light ? Object.keys(theme.light).length : 0;
  const darkCount = theme.dark ? Object.keys(theme.dark).length : 0;

  return lightCount + darkCount > 0;
}

export function buildCompanyThemeCss(theme: CompanyTheme): string {
  const rules: string[] = [];

  if (theme.light && Object.keys(theme.light).length > 0) {
    const variables = Object.entries(theme.light)
      .map(([token, value]) => `  --${token}: ${value};`)
      .join("\n");
    rules.push(`:root:not(.dark) {\n${variables}\n}`);
  }

  if (theme.dark && Object.keys(theme.dark).length > 0) {
    const variables = Object.entries(theme.dark)
      .map(([token, value]) => `  --${token}: ${value};`)
      .join("\n");
    rules.push(`.dark {\n${variables}\n}`);
  }

  return rules.join("\n");
}

export function createEmptyThemeFormState(): {
  light: Record<string, string>;
  dark: Record<string, string>;
} {
  return { light: {}, dark: {} };
}

export function themeToFormState(theme: CompanyTheme | null | undefined): {
  light: Record<string, string>;
  dark: Record<string, string>;
} {
  return {
    light: { ...(theme?.light ?? {}) },
    dark: { ...(theme?.dark ?? {}) },
  };
}

export function buildThemePayload(formState: {
  light: Record<string, string>;
  dark: Record<string, string>;
}): CompanyTheme | null {
  const light = Object.fromEntries(
    Object.entries(formState.light).filter(([, value]) => value.trim()),
  );
  const dark = Object.fromEntries(
    Object.entries(formState.dark).filter(([, value]) => value.trim()),
  );

  if (Object.keys(light).length === 0 && Object.keys(dark).length === 0) {
    return null;
  }

  return {
    ...(Object.keys(light).length > 0 ? { light } : {}),
    ...(Object.keys(dark).length > 0 ? { dark } : {}),
  };
}

export function hexToColorInputValue(value: string): string {
  const match = value.trim().match(/^#([0-9a-fA-F]{6})$/);
  return match ? `#${match[1]}` : "#000000";
}

export function isHexColor(value: string): boolean {
  return /^#([0-9a-fA-F]{6})$/i.test(value.trim());
}
