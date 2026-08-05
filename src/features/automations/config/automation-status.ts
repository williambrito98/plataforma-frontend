import {
  Check,
  Loader,
  Pause,
  Play,
  Settings2,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react";

import type { AutomationStatus } from "@/features/automations/types/automation";

type AutomationStatusConfig = {
  label: string;
  badgeVariant: "idle" | "success" | "info" | "warning" | "error";
  progressBarColor: string; 
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
    badgeVariant: "idle",
    progressBarColor: "bg-success-foreground",
    icon: Check,
    showProgress: false,
    action: { label: "Configurar", icon: Settings2 },
    alertTitle: "Pronto para iniciar",
    alertSubtitle: "Preencha os dados e clique em Iniciar",
  },
  running: {
    label: "Em execução",
    badgeVariant: "info",
    progressBarColor: "bg-progress-bar",
    icon: Loader,
    spinIcon: true,
    showProgress: true,
    action: { label: "Pausar", icon: Pause },
    alertTitle: "Executando...",
    alertSubtitle: "Clique para ver detalhes da execução",
  },
  paused: {
    label: "Pausado",
    badgeVariant: "warning",
    progressBarColor: "bg-warning-foreground",
    icon: Pause,
    showProgress: true,
    action: { label: "Retomar", icon: Play },
    alertTitle: "Execução pausada",
    alertSubtitle: "Retome ou cancele a automação",
  },
  maintenance: {
    label: "Em manutenção",
    badgeVariant: "error",
    progressBarColor: "bg-error-foreground",
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
