import { toast, Toaster as Sonner, type ToasterProps } from "sonner";
import { useTheme } from "next-themes";

import { Alert, type AlertProps } from "@/components/ui/alert";

type AlertVariant = NonNullable<AlertProps["variant"]>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { resolvedTheme } = useTheme();

  return (
    <Sonner
      theme={(resolvedTheme as "light" | "dark") ?? "light"}
      position="top-right"
      expand
      visibleToasts={4}
      closeButton
      className="toaster group"
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: "w-full max-w-[560px] p-0 bg-transparent border-0 shadow-none",
          closeButton:
            "absolute right-3 top-3 border-border bg-background text-foreground hover:bg-muted",
        },
      }}
      {...props}
    />
  );
};

function showAlert({
  variant = "info",
  title,
  description,
}: Pick<AlertProps, "variant" | "title" | "description">) {
  return toast.custom(() => (
    <Alert variant={variant} title={title} description={description} />
  ));
}

const alertToast = {
  success: (title: string, description?: string) =>
    showAlert({ variant: "success", title, description }),
  warning: (title: string, description?: string) =>
    showAlert({ variant: "warning", title, description }),
  error: (title: string, description?: string) =>
    showAlert({ variant: "error", title, description }),
  info: (title: string, description?: string) =>
    showAlert({ variant: "info", title, description }),
} satisfies Record<
  AlertVariant,
  (title: string, description?: string) => string | number
>;

export { Toaster, showAlert, alertToast };
