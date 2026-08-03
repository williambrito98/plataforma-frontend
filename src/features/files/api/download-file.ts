export function downloadFile(token: string): void {
  window.location.assign(
    `${import.meta.env.VITE_API_URL}/files/download/${token}`,
  );
}
