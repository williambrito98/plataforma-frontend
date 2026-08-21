export function buildTemplateDownloadUrl(token: string): string {
  const baseUrl = import.meta.env.VITE_API_URL.replace(/\/$/, "");
  return `${baseUrl}/automations/templates/${token}`;
}

export function downloadTemplateFile(token: string): void {
  window.location.assign(buildTemplateDownloadUrl(token));
}
