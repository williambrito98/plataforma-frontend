import { useState } from "react";
import { ptBR } from "date-fns/locale";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  formatDateValue,
  getDisplayFormat,
  parseDateValue,
  toDateValue,
} from "@/features/automations/components/field-pickers/date-format";
import { PickerTrigger } from "@/features/automations/components/field-pickers/picker-trigger";

type AutomationDatePickerFieldProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  format?: string;
  invalid?: boolean;
};

export function AutomationDatePickerField({
  id,
  value,
  onChange,
  onBlur,
  placeholder = "Selecione uma data",
  format: customFormat,
  invalid,
}: AutomationDatePickerFieldProps) {
  const [open, setOpen] = useState(false);
  const displayFormat = getDisplayFormat("date", customFormat);
  const selectedDate = parseDateValue(value);
  const displayValue = formatDateValue(value, displayFormat);

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          onBlur?.();
        }
      }}
    >
      <PopoverTrigger
        render={(triggerProps) => (
          <PickerTrigger
            {...triggerProps}
            id={id}
            value={displayValue}
            placeholder={placeholder}
            aria-invalid={invalid}
          />
        )}
      />
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          locale={ptBR}
          selected={selectedDate}
          defaultMonth={selectedDate}
          onSelect={(date) => {
            onChange(toDateValue(date));
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
