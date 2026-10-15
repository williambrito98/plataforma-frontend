import { FileArchive } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { AppModal } from "@/components/ui/modal";
import type {
  AutomationRuntime,
  AutomationStatus,
} from "@/features/automations/types/automation";

type AutomationSubmittedDataProps = {
  status: AutomationStatus;
  submittedValues: Record<string, string>;
  outputFile?: AutomationRuntime["outputFile"];
  isLoadingFile?: boolean;
  isCancelPending?: boolean;
  onCancel: () => void;
  onDownload?: () => void;
};

export function AutomationSubmittedData({
  status,
  submittedValues,
  outputFile,
  isLoadingFile = false,
  isCancelPending = false,
  onCancel,
  onDownload,
}: AutomationSubmittedDataProps) {
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const entries = Object.entries(submittedValues);
  const isCompleted = status === "completed";

  function handleConfirmCancel() {
    onCancel();
    setIsCancelModalOpen(false);
  }

  return (
    <>
      <div className="flex h-full flex-col justify-between space-y-4">
        <div className="space-y-4">
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-foreground">
              {isCompleted ? "Dados" : "Dados enviados"}
            </h4>
            {!isCompleted ? (
              <p className="text-sm text-muted-foreground">
                Valores utilizados na execução atual
              </p>
            ) : null}
          </div>

          <dl className="grid gap-3 sm:grid-cols-1">
            {entries.length === 0 ? (
              <p className="text-sm text-muted-foreground sm:col-span-2">
                Nenhum dado enviado.
              </p>
            ) : (
              entries.map(([label, value]) => (
                <div
                  key={label}
                  className={
                    isCompleted
                      ? "space-y-1"
                      : "space-y-1 rounded-lg bg-muted/30 p-3"
                  }
                >
                  <dt className="text-xs text-muted-foreground">{label}</dt>
                  <dd className="text-sm font-medium text-foreground max-xl:wrap-anywhere">
                    {value}
                  </dd>
                </div>
              ))
            )}
          </dl>
        </div>

        {isCompleted ? (
          outputFile ? (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Arquivo de saída</p>
              <Button
                variant="default"
                size="sm"
                className="w-full max-xl:h-11"
                onClick={onDownload}
                title={outputFile.name}
              >
                <FileArchive aria-hidden />
                <span className="max-xl:truncate">{outputFile.name}</span>
              </Button>
            </div>
          ) : isLoadingFile ? (
            <p className="text-sm text-muted-foreground">
              Carregando arquivo...
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Arquivo indisponível.
            </p>
          )
        ) : (
          <div className="flex justify-end">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsCancelModalOpen(true)}
              disabled={isCancelPending}
              loading={isCancelPending}
              className="max-md:w-full max-md:h-11"
            >
              Cancelar
            </Button>
          </div>
        )}
      </div>

      <AppModal
        variant="confirmation"
        open={isCancelModalOpen}
        onOpenChange={setIsCancelModalOpen}
        title="Você tem certeza absoluta?"
        description="Esta ação não poderá ser desfeita. Você perderá completamente seu progresso e os dados encontrados até aqui."
        onConfirm={handleConfirmCancel}
      />
    </>
  );
}
