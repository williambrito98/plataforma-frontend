import { getApiErrorMessage } from "@/lib/api-error";
import { apiClient } from "@/lib/api-client";

import {
  normalizeFile,
  type FileApiResponse,
  type FileItem,
} from "@/features/files/types/file";

export async function listFiles(companyId: string): Promise<FileItem[]> {
  try {
    const { data } = await apiClient.get<FileApiResponse[]>("/files", {
      params: { companyId },
    });
    return data.map(normalizeFile);
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Não foi possível carregar os arquivos."),
      { cause: error },
    );
  }
}
