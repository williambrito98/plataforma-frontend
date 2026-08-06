/**
 * Monta URL absoluta para rotas SSE usando a mesma base do Axios (`VITE_API_URL`).
 */
export function buildSseUrl(path: string): string {
  const baseUrl = import.meta.env.VITE_API_URL.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}
