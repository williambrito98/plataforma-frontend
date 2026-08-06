import { CalendarIcon, ChevronDownIcon } from "lucide-react";
import { forwardRef } from "react";

import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const pickerTriggerClassName =
  "h-8 w-full justify-between border-border bg-secondary px-3 font-normal shadow-none rounded-md";

type PickerTriggerProps = Omit<ButtonProps, "children"> & {
  value?: string;
  placeholder?: string;
};

export const PickerTrigger = forwardRef<HTMLButtonElement, PickerTriggerProps>(
  function PickerTrigger(
    {
      value,
      placeholder = "Selecione",
      className,
      type = "button",
      variant = "outline",
      ...props
    },
    ref,
  ) {
    return (
      <Button
        ref={ref}
        type={type}
        variant={variant}
        className={cn(
          pickerTriggerClassName,
          !value && "text-muted-foreground",
          className,
        )}
        {...props}
      >
        <span className="inline-flex min-w-0 items-center gap-2">
          <CalendarIcon className="size-4 shrink-0" />
          <span className="truncate">{value || placeholder}</span>
        </span>
        <ChevronDownIcon className="size-4 shrink-0 opacity-50" />
      </Button>
    );
  },
);
