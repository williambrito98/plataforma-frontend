import { useEffect, useRef, useState, useMemo } from "react";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import type {
  AutomationLogEntry,
  AutomationStatus,
} from "@/features/automations/types/automation";
import {
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AUTOMATION_STATUS_CONFIG } from "../config/automation-status";

type AutomationExecutionMonitorProps = {
  status: AutomationStatus;
  processed: number;
  total: number;
  logs: AutomationLogEntry[];
};

export function AutomationExecutionMonitor({
  status,
  processed,
  total,
  logs,
}: AutomationExecutionMonitorProps) {
  const percent =
  total > 0
    ? Math.min(100, Math.round((processed / total) * 1000) / 10)
    : 0;
  const config = AUTOMATION_STATUS_CONFIG[status];
  const badgeVariant = config.badgeVariant;
  const shouldAnimateLatestLog = status === "running";
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  // NOVO ESTADO: Rastreia quais itens estão abertos (ex: { "BARCELLOS": true })
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const groupedLogs = useMemo(() => {
    // 1. Agrupamento dos logs feito FORA da renderização para otimizar desempenho
    const groups: Record<string, { latestLog: AutomationLogEntry; steps: string[] }> = {};

    logs.forEach((log) => {
      const hasSplit = log.message.includes('\n');
      const clientKey = hasSplit ? log.message.split('\n')[0] : log.message;
      const stepText = hasSplit ? log.message.split('\n')[1] : log.message;

      if (!groups[clientKey]) {
        groups[clientKey] = { latestLog: log, steps: [] };
      }
      
      groups[clientKey].latestLog = log;
      
      // Evita duplicar a mesma sub-etapa no histórico
      if (hasSplit && !groups[clientKey].steps.includes(stepText)) {
        groups[clientKey].steps.push(stepText);
      }
    });
    return groups;
  }, [logs]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
  }, [logs]);

  return (
    <div className="flex flex-col gap-4">
      <Progress
        value={percent}
        className="w-full justify-between gap-0 [&_[data-slot=progress-track]]:hidden"
      >
        <ProgressLabel className="text-sm font-medium text-foreground">
          Monitor de execução
        </ProgressLabel>
        <ProgressValue className="ml-0 text-sm font-medium text-foreground" />
      </Progress>

      <div
        ref={scrollContainerRef}
        className="max-h-64 space-y-3 overflow-y-auto scroll-smooth rounded-lg bg-accent p-4 custom-scrollbar"
      >
        {logs.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhum log registrado ainda.
          </p>
        ) : (
          // 2. Mapeia o objeto agrupado em vez do array de logs brutos
          Object.entries(groupedLogs).map(([clientName, data]) => {
            const { latestLog, steps } = data;
            
            // Mantém a sua lógica exata para identificar o último evento geral
            const isLatestLog = latestLog.id === logs[logs.length - 1]?.id;
            const hasSteps = steps.length > 0;

            return (
              <Collapsible
                key={latestLog.id}
                className="w-full group"
                // Passa a controlar o estado baseado no nome do cliente
                open={!!openItems[clientName]}
                onOpenChange={(isOpen) => {
                  setOpenItems(prev => ({
                    ...prev,
                    [clientName]: isOpen
                  }));
                }}
              >
                <div className="flex items-start gap-4 py-0.5">
                  {/* Seu Span original de Status (Dot Animado) alinhado ao topo */}
                  <span className="relative inline-flex size-1.5 shrink-0 mt-2">
                    <span
                      aria-hidden
                      className={cn(
                        "absolute inset-0 rounded-full opacity-75",
                        badgeVariant === "error"
                          ? "bg-error"
                          : `bg-dot-${badgeVariant}-foreground`,
                        shouldAnimateLatestLog && isLatestLog && "animate-ping",
                      )}
                    />
                    <span
                      aria-hidden
                      className={cn(
                        "relative z-10 size-1.5 rounded-full",
                        badgeVariant === "error"
                          ? "bg-error"
                          : `bg-dot-${badgeVariant}-foreground`,
                      )}
                    />
                  </span>

                  {/* Diferenciação de UX: Se tiver etapas vira Colapsável, senão exibe texto simples */}
                  {hasSteps ? (
                    <CollapsibleTrigger className="flex flex-col text-left w-full hover:bg-foreground/5 rounded px-1 -mx-1 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between w-full">
                        <span className="text-sm font-medium text-foreground">{clientName}</span>
                        {/* Container dos Ícones Dinâmicos */}
                        <div className="text-muted-foreground shrink-0 ml-2">
                          {/* Ícone exibido apenas quando FECHADO (padrão block, fica hidden quando o grupo abre) */}
                          <ChevronDown className="size-4 block group-data-[open]:hidden" />
                          
                          {/* Ícone exibido apenas quando ABERTO (padrão hidden, vira block quando o grupo abre) */}
                          <ChevronUp className="size-4 hidden group-data-[open]:block" />
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {steps[steps.length - 1]}
                      </span>
                    </CollapsibleTrigger>
                  ) : (
                    <p className="text-sm text-foreground whitespace-pre-line">{latestLog.message}</p>
                  )}
                </div>

                {/* Histórico interno das sub-etapas do cliente */}
                {hasSteps && (
                  <CollapsibleContent className="pl-5 mt-1 space-y-1 border-l border-border/60 ml-0.5 overflow-hidden data-[state=closed]:animate-none data-[state=open]:animate-none">
                    {steps.map((step, stepIndex) => {
                      // Identifica se este passo específico dentro do loop é o último da sub-lista
                      const isLatestStep = stepIndex === steps.length - 1;

                      return (
                        <p key={stepIndex} className="text-xs text-muted-foreground/80 flex items-center gap-1.5 py-0.5">
                          {/* Micro-dot estilizado seguindo a configuração do badgeVariant */}
                          <span 
                            className={cn(
                              "size-1 rounded-full shrink-0 transition-colors duration-200",
                              // Aplica a cor com base no status do componente pai
                              badgeVariant === "error"
                                ? "bg-error"
                                : `bg-dot-${badgeVariant}-foreground`,
                              // Se não for a etapa mais recente, podemos aplicar uma leve opacidade 
                              // para dar uma hierarquia visual de histórico passado (Opcional para UX)
                              !isLatestStep && "opacity-50"
                            )} 
                          />
                          {step}
                        </p>
                      );
                    })}
                  </CollapsibleContent>
                )}
              </Collapsible>
            );
          })
        )}
      </div>
    </div>
  );
}
