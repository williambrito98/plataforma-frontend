import { getApiErrorMessage } from "@/lib/api-error";
import { apiClient } from "@/lib/api-client";

type ValidateSpreadsheetHeaderResponse = {
  valid: true;
  sheetCount: number;
};

export async function validateSpreadsheetHeader(
  file: File,
  expectedHeader: string[],
  options?: { csvDelimiter?: string; sheetName?: string },
): Promise<ValidateSpreadsheetHeaderResponse> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("expectedHeader", JSON.stringify(expectedHeader));

    if (options?.csvDelimiter) {
      formData.append("csvDelimiter", options.csvDelimiter);
    }

    if (options?.sheetName) {
      formData.append("sheetName", options.sheetName);
    }

    const { data } = await apiClient.post<ValidateSpreadsheetHeaderResponse>(
      "/spreadsheets/validate-header",
      formData,
    );

    return data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "O arquivo não está no formato correto"),
      { cause: error },
    );
  }
}
