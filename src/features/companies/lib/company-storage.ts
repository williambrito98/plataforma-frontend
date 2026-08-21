const STORAGE_PREFIX = "plataforma-selected-company";

function buildKey(userId: string): string {
  return `${STORAGE_PREFIX}:${userId}`;
}

export function readStoredCompanyId(userId: string): string | null {
  try {
    return localStorage.getItem(buildKey(userId));
  } catch {
    return null;
  }
}

export function writeStoredCompanyId(userId: string, companyId: string): void {
  try {
    localStorage.setItem(buildKey(userId), companyId);
  } catch {
    // Ignora falhas de persistência (modo privado, quota, etc.).
  }
}

export function clearStoredCompanyId(userId: string): void {
  try {
    localStorage.removeItem(buildKey(userId));
  } catch {
    // Ignora falhas de persistência.
  }
}
