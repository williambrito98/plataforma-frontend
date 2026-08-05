import type {
  AutomationStatus,
  ExecutionStatusApi,
} from "@/features/automations/types/automation";

const STATUS_MAP: Record<ExecutionStatusApi, AutomationStatus> = {
  PENDENTE: "idle",
  PARADO: "idle",
  RODANDO: "running",
  PAUSADO: "paused",
  EM_MANUTENCAO: "maintenance",
  CONCLUIDO: "completed",
};

export function mapExecutionStatus(
  status: ExecutionStatusApi,
): AutomationStatus {
  return STATUS_MAP[status] ?? "idle";
}
