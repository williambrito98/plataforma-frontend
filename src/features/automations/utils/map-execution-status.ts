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

const TERMINAL_API_STATUSES: ExecutionStatusApi[] = [
  "PENDENTE",
  "PARADO",
  "PAUSADO",
  "EM_MANUTENCAO",
  "CONCLUIDO",
];

export function mapExecutionStatus(
  status: ExecutionStatusApi,
): AutomationStatus {
  return STATUS_MAP[status] ?? "idle";
}

export function isTerminalApiStatus(status: ExecutionStatusApi): boolean {
  return TERMINAL_API_STATUSES.includes(status);
}
