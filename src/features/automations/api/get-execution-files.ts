import { apiClient } from "@/lib/api-client";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  type PaginatedApiResponse,
} from "@/lib/pagination";

export type ExecutionFileApiResponse = {
  name: string;
  token: string;
  size: number;
};

type GetExecutionFilesParams = {
  executionId: string;
  page?: number;
  limit?: number;
};

export async function getExecutionFiles({
  executionId,
  page = DEFAULT_PAGE,
  limit = DEFAULT_PAGE_SIZE,
}: GetExecutionFilesParams): Promise<ExecutionFileApiResponse[]> {
  const { data } = await apiClient.get<
    PaginatedApiResponse<ExecutionFileApiResponse>
  >(`/files/${executionId}`, {
    params: { page, limit },
  });

  return data.data;
}
