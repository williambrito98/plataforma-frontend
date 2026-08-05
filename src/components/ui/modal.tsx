import * as React from "react";
import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import type { LucideIcon } from "lucide-react";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { alertIcons } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const modalShellClassName =
  "gap-4 rounded-sm border border-muted-foreground bg-secondary p-6 text-foreground shadow-overlay sm:max-w-lg";

function Modal({ ...props }: DialogPrimitive.Root.Props) {
  return <Dialog data-slot="modal" {...props} />;
}

function ModalTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="modal-trigger" {...props} />;
}

function ModalContent({
  className,
  showCloseButton = false,
  ...props
}: React.ComponentProps<typeof DialogContent>) {
  return (
    <DialogContent
      data-slot="modal-content"
      showCloseButton={showCloseButton}
      className={cn(modalShellClassName, className)}
      {...props}
    />
  );
}

function ModalHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="modal-header"
      className={cn("flex flex-col gap-2 text-left", className)}
      {...props}
    />
  );
}

function ModalFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="modal-footer"
      className={cn("flex justify-end gap-2.5", className)}
      {...props}
    />
  );
}

function ModalTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogTitle>) {
  return (
    <DialogTitle
      data-slot="modal-title"
      className={cn("text-lg font-bold", className)}
      {...props}
    />
  );
}

function ModalDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogDescription>) {
  return (
    <DialogDescription
      data-slot="modal-description"
      className={cn("text-base text-foreground", className)}
      {...props}
    />
  );
}

function ModalCancel({
  className,
  variant = "outline",
  size = "lg",
  ...props
}: DialogPrimitive.Close.Props &
  Pick<React.ComponentProps<typeof Button>, "variant" | "size">) {
  return (
    <DialogClose
      data-slot="modal-cancel"
      className={cn(className)}
      render={<Button variant={variant} size={size} />}
      {...props}
    />
  );
}

function ModalAction({
  className,
  size = "lg",
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      data-slot="modal-action"
      size={size}
      className={cn(className)}
      {...props}
    />
  );
}

type AppModalVariant = "confirmation" | "alert" | "modal";

type AlertTone = keyof typeof alertIcons;

type AppModalProps = {
  variant: AppModalVariant;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: React.ReactNode;
  children?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  loading?: boolean;
  alertTone?: AlertTone;
};

const defaultLabels: Record<
  AppModalVariant,
  { confirm: string; cancel?: string }
> = {
  confirmation: { confirm: "Confirmar", cancel: "Voltar" },
  alert: { confirm: "Entendi" },
  modal: { confirm: "Confirmar", cancel: "Cancelar" },
};

function AppModalAlertIcon({ tone }: { tone: AlertTone }) {
  const Icon = alertIcons[tone] as LucideIcon;

  return (
    <Icon className="size-5 shrink-0 text-warning-foreground" aria-hidden />
  );
}

function AppModalBlockingContent({
  variant,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  loading,
  alertTone = "warning",
  children,
}: Omit<AppModalProps, "open" | "onOpenChange">) {
  const labels = defaultLabels[variant];
  const resolvedConfirmLabel = confirmLabel ?? labels.confirm;
  const resolvedCancelLabel = cancelLabel ?? labels.cancel;

  return (
    <>
      <div
        data-slot="modal-header"
        className={cn(
          "flex flex-col gap-2 text-left",
          variant === "alert" && "gap-3",
        )}
      >
        {variant === "alert" ? <AppModalAlertIcon tone={alertTone} /> : null}
        <AlertDialogTitle className="text-lg font-bold">
          {title}
        </AlertDialogTitle>
        {description ? (
          <AlertDialogDescription className="text-base text-foreground">
            {description}
          </AlertDialogDescription>
        ) : null}
      </div>

      {children}

      <div data-slot="modal-footer" className="flex justify-end gap-2.5">
        {variant === "confirmation" || variant === "modal" ? (
          <AlertDialogPrimitive.Close
            data-slot="modal-cancel"
            render={<Button variant="outline" size="lg" />}
            disabled={loading}
          >
            {resolvedCancelLabel}
          </AlertDialogPrimitive.Close>
        ) : null}

        {variant === "alert" ? (
          <AlertDialogPrimitive.Close
            data-slot="modal-action"
            render={<Button size="lg" />}
          >
            {resolvedConfirmLabel}
          </AlertDialogPrimitive.Close>
        ) : (
          <Button
            data-slot="modal-action"
            type="button"
            size="lg"
            variant={variant === "confirmation" ? "destructive" : "default"}
            loading={loading}
            onClick={onConfirm}
          >
            {resolvedConfirmLabel}
          </Button>
        )}
      </div>
    </>
  );
}

function AppModal({
  variant,
  open,
  onOpenChange,
  title,
  description,
  children,
  confirmLabel,
  cancelLabel,
  onConfirm,
  loading = false,
  alertTone = "warning",
}: AppModalProps) {
  if (variant === "modal") {
    return (
      <Modal open={open} onOpenChange={onOpenChange}>
        <ModalContent showCloseButton={false}>
          <ModalHeader>
            <ModalTitle>{title}</ModalTitle>
            {description ? (
              <ModalDescription>{description}</ModalDescription>
            ) : null}
          </ModalHeader>
          {children}
          <ModalFooter>
            <ModalCancel disabled={loading}>
              {cancelLabel ?? defaultLabels.modal.cancel}
            </ModalCancel>
            <ModalAction loading={loading} onClick={onConfirm}>
              {confirmLabel ?? defaultLabels.modal.confirm}
            </ModalAction>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className={modalShellClassName}>
        <AppModalBlockingContent
          variant={variant}
          title={title}
          description={description}
          confirmLabel={confirmLabel}
          cancelLabel={cancelLabel}
          onConfirm={onConfirm}
          loading={loading}
          alertTone={alertTone}
        >
          {children}
        </AppModalBlockingContent>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export {
  AppModal,
  Modal,
  ModalAction,
  ModalCancel,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
};
export type { AppModalProps, AppModalVariant, AlertTone };
