export type FileApiResponse = {
  id: string;
  executionId: string;
  name: string;
  token: string;
  createdAt: string;
  updatedAt: string;
  size: number;
  execution: {
    id: string;
    automationName?: string;
  } | null;
};

export type FileItem = {
  id: string;
  name: string;
  token: string;
  createdAt: string;
  sizeBytes: number;
};

export function normalizeFile(file: FileApiResponse): FileItem {
  return {
    id: file.id,
    name: file.name,
    token: file.token,
    createdAt: file.createdAt,
    sizeBytes: file.size,
  };
}
