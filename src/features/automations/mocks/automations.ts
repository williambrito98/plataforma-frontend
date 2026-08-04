import type {
  AutomationListItem,
  AutomationLogEntry,
  AutomationRuntime,
} from "@/features/automations/types/automation";

export const AUTOMATION_LOG_SCRIPT: Array<{
  message: string;
  variant: AutomationLogEntry["variant"];
}> = [
  { message: "Iniciando automação", variant: "info" },
  { message: "Acessando e-Cac", variant: "info" },
  { message: "Autenticando certificado digital", variant: "info" },
  { message: "Consultando pendências", variant: "info" },
  { message: "Transmitindo eventos", variant: "info" },
  { message: "Processando lote", variant: "info" },
  { message: "Validando retorno", variant: "info" },
  { message: "Finalizando transmissão", variant: "info" },
];

export const MOCK_AUTOMATIONS: AutomationListItem[] = [
  {
    id: "auto-reinf",
    name: "REINF — Eventos periódicos",
    category: "fiscal",
    categoryLabel: "Fiscal",
    defaultTotal: 294,
    fields: [
      {
        id: "reinf-file",
        name: "arquivo",
        type: "file",
        label: "Arquivo de eventos",
        required: true,
      },
      {
        id: "reinf-competencia",
        name: "competencia",
        type: "date",
        label: "Competência",
        required: true,
      },
      {
        id: "reinf-ambiente",
        name: "ambiente",
        type: "select",
        label: "Ambiente",
        required: true,
        options: [
          { value: "producao", label: "Produção" },
          { value: "restrita", label: "Restrita" },
        ],
      },
    ],
  },
  {
    id: "auto-dctfweb",
    name: "DCTFWeb — Declaração mensal",
    category: "fiscal",
    categoryLabel: "Fiscal",
    defaultTotal: 128,
    fields: [
      {
        id: "dctf-periodo",
        name: "periodo",
        type: "date-range",
        label: "Período de apuração",
        required: true,
      },
      {
        id: "dctf-cnpj",
        name: "cnpj",
        type: "text",
        label: "CNPJ",
        placeholder: "00.000.000/0000-00",
        required: true,
      },
      {
        id: "dctf-obs",
        name: "observacoes",
        type: "textarea",
        label: "Observações",
        placeholder: "Informações adicionais (opcional)",
        required: false,
      },
    ],
  },
  {
    id: "auto-esocial",
    name: "eSocial — Envio de eventos",
    category: "trabalhista",
    categoryLabel: "Trabalhista",
    defaultTotal: 512,
    fields: [
      {
        id: "esocial-lote",
        name: "lote",
        type: "file",
        label: "Lote XML",
        required: true,
      },
      {
        id: "esocial-tipo",
        name: "tipoEvento",
        type: "select",
        label: "Tipo de evento",
        required: true,
        options: [
          { value: "s1200", label: "S-1200 — Remuneração" },
          { value: "s1210", label: "S-1210 — Pagamentos" },
          { value: "s1299", label: "S-1299 — Fechamento" },
        ],
      },
      {
        id: "esocial-confirmar",
        name: "confirmarEnvio",
        type: "checkbox",
        label: "Confirmo que os dados foram revisados",
        required: true,
      },
    ],
  },
  {
    id: "auto-sped",
    name: "SPED Contábil — ECD",
    category: "contabil",
    categoryLabel: "Contábil",
    defaultTotal: 86,
    fields: [
      {
        id: "sped-ano",
        name: "ano",
        type: "number",
        label: "Ano-calendário",
        placeholder: "2026",
        required: true,
      },
      {
        id: "sped-email",
        name: "email",
        type: "email",
        label: "E-mail de retorno",
        placeholder: "contabilidade@empresa.com.br",
        required: true,
      },
      {
        id: "sped-arquivo",
        name: "arquivoEcd",
        type: "file",
        label: "Arquivo ECD",
        required: true,
      },
    ],
  },
  {
    id: "auto-folha",
    name: "Folha de pagamento — Fechamento",
    category: "pessoal",
    categoryLabel: "Pessoal",
    defaultTotal: 64,
    fields: [
      {
        id: "folha-mes",
        name: "mesReferencia",
        type: "date",
        label: "Mês de referência",
        required: true,
      },
      {
        id: "folha-senha",
        name: "senhaCertificado",
        type: "password",
        label: "Senha do certificado",
        required: true,
      },
      {
        id: "folha-reprocessar",
        name: "reprocessar",
        type: "checkbox",
        label: "Reprocessar colaboradores com erro",
        required: false,
      },
    ],
  },
];

const maintenanceRuntime: AutomationRuntime = {
  status: "maintenance",
  processed: 50,
  total: 294,
  startedAt: "2026-08-03T20:15:00.000Z",
  finishedAt: null,
  elapsedSeconds: 1847,
  errorMessage: "Falha na autenticação do certificado digital",
  submittedValues: {
    lote: "lote-esocial-agosto.xml",
    tipoEvento: "S-1200 — Remuneração",
    confirmarEnvio: "Sim",
  },
  logs: [
    {
      id: "log-1",
      time: "20:15:02",
      message: "Iniciando automação",
      variant: "info",
    },
    {
      id: "log-2",
      time: "20:15:18",
      message: "Acessando e-Cac",
      variant: "info",
    },
    {
      id: "log-3",
      time: "20:16:04",
      message: "Autenticando certificado digital",
      variant: "info",
    },
    {
      id: "log-4",
      time: "20:45:47",
      message: "Falha na autenticação do certificado digital",
      variant: "error",
    },
  ],
};

export const MOCK_INITIAL_RUNTIMES: Record<string, AutomationRuntime> =
  Object.fromEntries(
    MOCK_AUTOMATIONS.map((automation) => [
      automation.id,
      automation.id === "auto-esocial"
        ? maintenanceRuntime
        : {
            status: "idle" as const,
            processed: 0,
            total: 0,
            startedAt: null,
            finishedAt: null,
            elapsedSeconds: 0,
            logs: [],
            submittedValues: {},
          },
    ]),
  );

export function formatLogTime(date: Date): string {
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export function formatDisplayDate(iso: string | null): string {
  if (!iso) {
    return "--/--/----";
  }

  return new Intl.DateTimeFormat("pt-BR").format(new Date(iso));
}

export function formatElapsedTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
}
