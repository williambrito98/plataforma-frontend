import { useMemo, useState } from "react";

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
  formatTimeValue,
  getDisplayFormat,
  parseTimeValue,
  toTimeValue,
} from "@/features/automations/components/field-pickers/date-format";
import { PickerTrigger } from "@/features/automations/components/field-pickers/picker-trigger";

type AutomationTimePickerFieldProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  format?: string;
  step?: number;
  invalid?: boolean;
};

function buildTimeOptions(step: number) {
  const minuteStep = step > 0 && step < 60 ? step : 1;
  const hours = Array.from({ length: 24 }, (_, index) => index);
  const minutes = Array.from(
    { length: Math.ceil(60 / minuteStep) },
    (_, index) => index * minuteStep,
  );

  return { hours, minutes, minuteStep };
}

export function AutomationTimePickerField({
  id,
  value,
  onChange,
  onBlur,
  placeholder = "Selecione um horário",
  format: customFormat,
  step = 1,
  invalid,
}: AutomationTimePickerFieldProps) {
  const [open, setOpen] = useState(false);
  const displayFormat = getDisplayFormat("time", customFormat);
  const parsed = parseTimeValue(value);
  const displayValue = formatTimeValue(value, displayFormat);
  const { hours, minutes } = useMemo(() => buildTimeOptions(step), [step]);

  function handleHourChange(nextHour: string | null) {
    if (nextHour === null) {
      return;
    }

    const current = parseTimeValue(value) ?? { hours: 0, minutes: 0 };
    onChange(toTimeValue(Number(nextHour), current.minutes));
  }

  function handleMinuteChange(nextMinute: string | null) {
    if (nextMinute === null) {
      return;
    }

    const current = parseTimeValue(value) ?? { hours: 0, minutes: 0 };
    onChange(toTimeValue(current.hours, Number(nextMinute)));
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
            value={parsed ? String(parsed.hours) : null}
            items={hours.map((hour) => ({
              value: String(hour),
              label: String(hour).padStart(2, "0"),
            }))}
            onValueChange={handleHourChange}
          >
            <SelectTrigger size="sm" className="w-full">
              <SelectValue placeholder="Hora" />
            </SelectTrigger>
            <SelectContent>
              {hours.map((hour) => (
                <SelectItem key={hour} value={String(hour)}>
                  {String(hour).padStart(2, "0")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={parsed ? String(parsed.minutes) : null}
            items={minutes.map((minute) => ({
              value: String(minute),
              label: String(minute).padStart(2, "0"),
            }))}
            onValueChange={handleMinuteChange}
          >
            <SelectTrigger size="sm" className="w-full">
              <SelectValue placeholder="Min" />
            </SelectTrigger>
            <SelectContent>
              {minutes.map((minute) => (
                <SelectItem key={minute} value={String(minute)}>
                  {String(minute).padStart(2, "0")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </PopoverContent>
    </Popover>
  );
}
