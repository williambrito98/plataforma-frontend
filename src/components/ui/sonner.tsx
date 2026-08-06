import { XIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { toast, Toaster as Sonner, type ToasterProps } from "sonner";

import { Alert, type AlertProps } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

type AlertVariant = NonNullable<AlertProps["variant"]>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { resolvedTheme } = useTheme();

  return (
    <Sonner
      theme={(resolvedTheme as "light" | "dark") ?? "light"}
      position="top-right"
      expand
      visibleToasts={4}
      className="toaster group"
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: "w-full max-w-[560px] p-0 bg-transparent border-0 shadow-none",
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
  return toast.custom((t) => (
    <div className="relative w-full">
      <Alert
        className="pr-10"
        variant={variant}
        title={title}
        description={description}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
        onClick={() => toast.dismiss(t)}
        aria-label="Fechar"
      >
        <XIcon />
      </Button>
    </div>
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
