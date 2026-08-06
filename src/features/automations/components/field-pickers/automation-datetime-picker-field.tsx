import { setHours, setMinutes } from "date-fns";
import { useState } from "react";
import { ptBR } from "date-fns/locale";

import { Calendar } from "@/components/ui/calendar";
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
  formatDateTimeValue,
  getDisplayFormat,
  parseDateTimeValue,
  parseTimeValue,
  toDateTimeValue,
  toTimeValue,
} from "@/features/automations/components/field-pickers/date-format";
import { PickerTrigger } from "@/features/automations/components/field-pickers/picker-trigger";

type AutomationDateTimePickerFieldProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  format?: string;
  invalid?: boolean;
};

const HOURS = Array.from({ length: 24 }, (_, index) => index);
const MINUTES = Array.from({ length: 60 }, (_, index) => index);

export function AutomationDateTimePickerField({
  id,
  value,
  onChange,
  onBlur,
  placeholder = "Selecione data e hora",
  format: customFormat,
  invalid,
}: AutomationDateTimePickerFieldProps) {
  const [open, setOpen] = useState(false);
  const displayFormat = getDisplayFormat("datetime-local", customFormat);
  const selectedDate = parseDateTimeValue(value);
  const timeValue = selectedDate
    ? toTimeValue(selectedDate.getHours(), selectedDate.getMinutes())
    : "";
  const parsedTime = parseTimeValue(timeValue);
  const displayValue = formatDateTimeValue(value, displayFormat);

  function updateDateTime(date: Date | undefined, time: string) {
    if (!date) {
      onChange("");
      return;
    }

    const parsed = parseTimeValue(time) ?? { hours: 0, minutes: 0 };
    const nextDate = setMinutes(setHours(date, parsed.hours), parsed.minutes);
    onChange(toDateTimeValue(nextDate));
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
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          locale={ptBR}
          selected={selectedDate}
          defaultMonth={selectedDate}
          onSelect={(date) => {
            updateDateTime(date, timeValue || "00:00");
          }}
        />
        <div className="grid grid-cols-2 gap-2 border-t border-border p-3">
          <Select
            value={parsedTime ? String(parsedTime.hours) : null}
            items={HOURS.map((hour) => ({
              value: String(hour),
              label: String(hour).padStart(2, "0"),
            }))}
            onValueChange={(nextHour) => {
              if (nextHour === null || !selectedDate) {
                return;
              }

              const current = parseTimeValue(timeValue) ?? {
                hours: 0,
                minutes: 0,
              };
              updateDateTime(
                selectedDate,
                toTimeValue(Number(nextHour), current.minutes),
              );
            }}
          >
            <SelectTrigger size="sm" className="w-full">
              <SelectValue placeholder="Hora" />
            </SelectTrigger>
            <SelectContent>
              {HOURS.map((hour) => (
                <SelectItem key={hour} value={String(hour)}>
                  {String(hour).padStart(2, "0")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={parsedTime ? String(parsedTime.minutes) : null}
            items={MINUTES.map((minute) => ({
              value: String(minute),
              label: String(minute).padStart(2, "0"),
            }))}
            onValueChange={(nextMinute) => {
              if (nextMinute === null || !selectedDate) {
                return;
              }

              const current = parseTimeValue(timeValue) ?? {
                hours: 0,
                minutes: 0,
              };
              updateDateTime(
                selectedDate,
                toTimeValue(current.hours, Number(nextMinute)),
              );
            }}
          >
            <SelectTrigger size="sm" className="w-full">
              <SelectValue placeholder="Min" />
            </SelectTrigger>
            <SelectContent>
              {MINUTES.map((minute) => (
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
