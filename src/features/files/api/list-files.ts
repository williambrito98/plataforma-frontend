import { getApiErrorMessage } from "@/lib/api-error";
import { apiClient } from "@/lib/api-client";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  type PaginatedApiResponse,
  type PaginatedResult,
} from "@/lib/pagination";

import {
  normalizeFile,
  type FileApiResponse,
  type FileItem,
} from "@/features/files/types/file";

type ListFilesParams = {
  companyId: string;
  page?: number;
  limit?: number;
};

export async function listFiles({
  companyId,
  page = DEFAULT_PAGE,
  limit = DEFAULT_PAGE_SIZE,
}: ListFilesParams): Promise<PaginatedResult<FileItem>> {
  try {
    const { data } = await apiClient.get<PaginatedApiResponse<FileApiResponse>>(
      "/files",
      {
        params: { companyId, page, limit },
      },
    );

    return {
      items: data.data.map(normalizeFile),
      meta: data.meta,
    };
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Não foi possível carregar os arquivos."),
      { cause: error },
    );
  }
}
