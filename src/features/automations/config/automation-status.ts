import {
  Check,
  Loader2,
  Pause,
  Play,
  Settings2,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react";

import type { AutomationStatus } from "@/features/automations/types/automation";

type AutomationStatusConfig = {
  label: string;
  badgeVariant: "success" | "info" | "warning" | "error";
  icon: LucideIcon;
  spinIcon?: boolean;
  showProgress: boolean;
  action: { label: string; icon: LucideIcon };
  alertTitle: string;
  alertSubtitle: string;
};

export const AUTOMATION_STATUS_CONFIG: Record<
  AutomationStatus,
  AutomationStatusConfig
> = {
  idle: {
    label: "Parado",
    badgeVariant: "success",
    icon: Check,
    showProgress: false,
    action: { label: "Configurar", icon: Settings2 },
    alertTitle: "Pronto para iniciar",
    alertSubtitle: "Preencha os dados e clique em Iniciar",
  },
  running: {
    label: "Em execução",
    badgeVariant: "info",
    icon: Loader2,
    spinIcon: true,
    showProgress: true,
    action: { label: "Pausar", icon: Pause },
    alertTitle: "Transmissão em andamento",
    alertSubtitle: "Aguarde a conclusão do processamento",
  },
  paused: {
    label: "Pausado",
    badgeVariant: "warning",
    icon: Pause,
    showProgress: true,
    action: { label: "Retomar", icon: Play },
    alertTitle: "Execução pausada",
    alertSubtitle: "Retome ou cancele a automação",
  },
  maintenance: {
    label: "Em manutenção",
    badgeVariant: "error",
    icon: ShieldAlert,
    showProgress: true,
    action: { label: "Reportar", icon: ShieldAlert },
    alertTitle: "Falha na execução",
    alertSubtitle: "Verifique os logs e reporte o problema",
  },
};

export const AUTOMATION_CATEGORY_LABELS: Record<
  import("@/features/automations/types/automation").AutomationCategorySlug,
  string
> = {
  fiscal: "Fiscal",
  pessoal: "Pessoal",
  contabil: "Contábil",
  trabalhista: "Trabalhista",
};
