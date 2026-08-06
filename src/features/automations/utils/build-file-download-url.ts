export function buildFileDownloadUrl(token: string): string {
  const baseUrl = import.meta.env.VITE_API_URL.replace(/\/$/, "");
  return `${baseUrl}/files/download/${token}`;
}
