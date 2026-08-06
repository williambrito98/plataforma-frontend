import { buildFileDownloadUrl } from "@/features/automations/utils/build-file-download-url";

export function downloadFile(token: string): void {
  window.location.assign(buildFileDownloadUrl(token));
}
