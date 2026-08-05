import { AppModal } from "@/components/ui/modal";

type DeleteCategoryDialogProps = {
  categoryName: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending: boolean;
};

export function DeleteCategoryDialog({
  categoryName,
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: DeleteCategoryDialogProps) {
  return (
    <AppModal
      variant="confirmation"
      open={open}
      onOpenChange={onOpenChange}
      title="Remover categoria"
      description={
        <>
          Tem certeza que deseja remover a categoria{" "}
          <span className="font-medium text-foreground">{categoryName}</span>?
          Esta ação não pode ser desfeita. Categorias com automações vinculadas
          não podem ser removidas.
        </>
      }
      cancelLabel="Cancelar"
      confirmLabel="Excluir"
      onConfirm={onConfirm}
      loading={isPending}
    />
  );
}
