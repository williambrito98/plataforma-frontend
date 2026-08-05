import { useState } from "react";

import { Button } from "@/components/ui/button";
import { AppModal } from "@/components/ui/modal";

type AutomationSubmittedDataProps = {
  submittedValues: Record<string, string>;
  onCancel: () => void;
};

export function AutomationSubmittedData({
  submittedValues,
  onCancel,
}: AutomationSubmittedDataProps) {
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const entries = Object.entries(submittedValues);

  function handleConfirmCancel() {
    onCancel();
    setIsCancelModalOpen(false);
  }

  return (
    <>
      <div className="space-y-4">
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-foreground">
            Dados enviados
          </h4>
          <p className="text-sm text-muted-foreground">
            Valores utilizados na execução atual
          </p>
        </div>

        <dl className="grid gap-3 sm:grid-cols-1">
          {entries.length === 0 ? (
            <p className="text-sm text-muted-foreground sm:col-span-2">
              Nenhum dado enviado.
            </p>
          ) : (
            entries.map(([label, value]) => (
              <div key={label} className="space-y-1 rounded-lg bg-muted/30 p-3">
                <dt className="text-xs text-muted-foreground">{label}</dt>
                <dd className="text-sm font-medium text-foreground">{value}</dd>
              </div>
            ))
          )}
        </dl>

        <div className="flex justify-end">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setIsCancelModalOpen(true)}
          >
            Cancelar
          </Button>
        </div>
      </div>

      <AppModal
        variant="confirmation"
        open={isCancelModalOpen}
        onOpenChange={setIsCancelModalOpen}
        title="Você tem certeza absoluta?"
        description="Está ação não poderá ser desfeita. Você perderá completamente seu progresso e os dados encotrados até aqui."
        onConfirm={handleConfirmCancel}
      />
    </>
  );
}
