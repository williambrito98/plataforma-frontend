export const SPREADSHEET_EXTENSIONS = ["xlsx", "xls", "csv"] as const;

function normalizeExtension(extension: string): string {
  return extension.replace(/^\./, "").toLowerCase();
}

export function getFileExtension(fileName: string): string | null {
  const parts = fileName.split(".");
  if (parts.length < 2) {
    return null;
  }

  return parts.pop()?.toLowerCase() ?? null;
}

export function isSpreadsheetExtension(extension: string): boolean {
  return SPREADSHEET_EXTENSIONS.includes(
    normalizeExtension(extension) as (typeof SPREADSHEET_EXTENSIONS)[number],
  );
}

export function isSpreadsheetFile(file: File): boolean {
  const extension = getFileExtension(file.name);
  return extension ? isSpreadsheetExtension(extension) : false;
}

export function fieldAcceptsSpreadsheet(extensions?: string[]): boolean {
  if (!extensions?.length) {
    return true;
  }

  return extensions.some((extension) => isSpreadsheetExtension(extension));
}

export function getSpreadsheetFileFromValue(value: unknown): File | null {
  if (value instanceof FileList && value.length > 0) {
    return value.item(0);
  }

  if (value instanceof File) {
    return value;
  }

  return null;
}
