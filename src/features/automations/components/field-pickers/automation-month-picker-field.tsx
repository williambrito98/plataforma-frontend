import { useMemo, useState } from "react";
import { format, setMonth } from "date-fns";
import { ptBR } from "date-fns/locale";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  formatMonthValue,
  getDisplayFormat,
  parseMonthParts,
  toMonthValueFromParts,
} from "@/features/automations/components/field-pickers/date-format";
import { PickerTrigger } from "@/features/automations/components/field-pickers/picker-trigger";

type AutomationMonthPickerFieldProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  format?: string;
  invalid?: boolean;
};

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_RANGE = 100;

function buildMonthOptions() {
  return Array.from({ length: 12 }, (_, index) => {
    const month = index + 1;
    const date = setMonth(new Date(2000, 0, 1), index);

    return {
      value: String(month),
      label: format(date, "MMMM", { locale: ptBR }),
    };
  });
}

function buildYearOptions() {
  const startYear = CURRENT_YEAR - YEAR_RANGE;
  const endYear = CURRENT_YEAR + 10;

  return Array.from({ length: endYear - startYear + 1 }, (_, index) => {
    const year = startYear + index;
    return {
      value: String(year),
      label: String(year),
    };
  }).reverse();
}

export function AutomationMonthPickerField({
  id,
  value,
  onChange,
  onBlur,
  placeholder = "Selecione um mês",
  format: customFormat,
  invalid,
}: AutomationMonthPickerFieldProps) {
  const [open, setOpen] = useState(false);
  const displayFormat = getDisplayFormat("month", customFormat);
  const parsed = parseMonthParts(value);
  const displayValue = formatMonthValue(value, displayFormat);
  const months = useMemo(() => buildMonthOptions(), []);
  const years = useMemo(() => buildYearOptions(), []);

  function handleMonthChange(nextMonth: string | null) {
    if (nextMonth === null) {
      return;
    }

    const current = parseMonthParts(value) ?? {
      month: Number(nextMonth),
      year: CURRENT_YEAR,
    };
    onChange(toMonthValueFromParts(Number(nextMonth), current.year));
  }

  function handleYearChange(nextYear: string | null) {
    if (nextYear === null) {
      return;
    }

    const current = parseMonthParts(value) ?? {
      month: 1,
      year: Number(nextYear),
    };
    onChange(toMonthValueFromParts(current.month, Number(nextYear)));
  }

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
      <PopoverContent className="w-auto p-3" align="start">
        <div className="grid grid-cols-2 gap-2">
          <Select
            value={parsed ? String(parsed.month) : null}
            items={months}
            onValueChange={handleMonthChange}
          >
            <SelectTrigger size="sm" className="w-full min-w-32">
              <SelectValue placeholder="Mês" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={parsed ? String(parsed.year) : null}
            items={years}
            onValueChange={handleYearChange}
          >
            <SelectTrigger size="sm" className="w-full min-w-24">
              <SelectValue placeholder="Ano" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year.value} value={year.value}>
                  {year.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </PopoverContent>
    </Popover>
  );
}
