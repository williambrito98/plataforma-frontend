import { apiClient } from "@/lib/api-client";

export type ExecutionFileApiResponse = {
  name: string;
  token: string;
  size: number;
};

export async function getExecutionFiles(
  executionId: string,
): Promise<ExecutionFileApiResponse[]> {
  const { data } = await apiClient.get<ExecutionFileApiResponse[]>(
    `/files/${executionId}`,
  );
  return data;
}
