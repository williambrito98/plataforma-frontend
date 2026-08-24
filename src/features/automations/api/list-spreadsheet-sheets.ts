import { getApiErrorMessage } from "@/lib/api-error";
import { apiClient } from "@/lib/api-client";

type SpreadsheetSheetsResponse = {
  sheets: string[];
};

export async function listSpreadsheetSheets(file: File): Promise<string[]> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await apiClient.post<SpreadsheetSheetsResponse>(
      "/spreadsheets/sheets",
      formData,
    );

    return data.sheets;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(
        error,
        "Não foi possível identificar as abas da planilha.",
      ),
      { cause: error },
    );
  }
}
