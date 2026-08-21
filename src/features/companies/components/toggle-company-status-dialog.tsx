import { AppModal } from "@/components/ui/modal";
import type { CompanyStatus } from "@/features/companies/types/company";

type ToggleCompanyStatusDialogProps = {
  companyName: string | null;
  targetStatus: CompanyStatus | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending: boolean;
};

export function ToggleCompanyStatusDialog({
  companyName,
  targetStatus,
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: ToggleCompanyStatusDialogProps) {
  const isDeactivating = targetStatus === "INATIVA";

  return (
    <AppModal
      variant="confirmation"
      open={open}
      onOpenChange={onOpenChange}
      title={isDeactivating ? "Inativar empresa" : "Ativar empresa"}
      description={
        <>
          Tem certeza que deseja {isDeactivating ? "inativar" : "ativar"} a
          empresa{" "}
          <span className="font-medium text-foreground">{companyName}</span>?
          {isDeactivating
            ? " Usuários não poderão mais selecioná-la no login ou no seletor."
            : " Usuários vinculados poderão selecioná-la novamente."}
        </>
      }
      cancelLabel="Cancelar"
      confirmLabel={isDeactivating ? "Inativar" : "Ativar"}
      onConfirm={onConfirm}
      loading={isPending}
    />
  );
}
