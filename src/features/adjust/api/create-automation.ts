import type { CreateAutomationPayload } from "@/features/adjust/types/adjust";

export async function createAutomationMock(
  payload: CreateAutomationPayload,
): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  void payload;
}
