import { AppModal } from "@/components/ui/modal";

type DeleteUserDialogProps = {
  userName: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending: boolean;
};

export function DeleteUserDialog({
  userName,
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: DeleteUserDialogProps) {
  return (
    <AppModal
      variant="confirmation"
      open={open}
      onOpenChange={onOpenChange}
      title="Remover usuário"
      description={
        <>
          Tem certeza que deseja remover o usuário{" "}
          <span className="font-medium text-foreground">{userName}</span>? Esta
          ação não pode ser desfeita.
        </>
      }
      cancelLabel="Cancelar"
      confirmLabel="Excluir"
      onConfirm={onConfirm}
      loading={isPending}
    />
  );
}
