import {
  format,
  isValid,
  parse,
  setHours,
  setMinutes,
  startOfMonth,
} from "date-fns";
import { ptBR } from "date-fns/locale";

export const DEFAULT_DATE_FORMAT = "dd/MM/yyyy";
export const DEFAULT_TIME_FORMAT = "HH:mm";
export const DEFAULT_DATETIME_FORMAT = "dd/MM/yyyy HH:mm";
export const DEFAULT_MONTH_FORMAT = "MM/yyyy";

export function getDisplayFormat(
  type: "date" | "time" | "datetime-local" | "month",
  customFormat?: string,
): string {
  if (customFormat) {
    return customFormat;
  }

  switch (type) {
    case "date":
      return DEFAULT_DATE_FORMAT;
    case "time":
      return DEFAULT_TIME_FORMAT;
    case "datetime-local":
      return DEFAULT_DATETIME_FORMAT;
    case "month":
      return DEFAULT_MONTH_FORMAT;
  }
}

export function parseDateValue(value: string | undefined): Date | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = parse(value, "yyyy-MM-dd", new Date());
  return isValid(parsed) ? parsed : undefined;
}

export function formatDateValue(
  value: string | undefined,
  displayFormat?: string,
): string {
  const date = parseDateValue(value);
  if (!date) {
    return "";
  }

  return format(date, displayFormat ?? DEFAULT_DATE_FORMAT, { locale: ptBR });
}

export function toDateValue(date: Date | undefined): string {
  if (!date || !isValid(date)) {
    return "";
  }

  return format(date, "yyyy-MM-dd");
}

export function parseTimeValue(value: string | undefined): {
  hours: number;
  minutes: number;
} | null {
  if (!value) {
    return null;
  }

  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) {
    return null;
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (hours > 23 || minutes > 59) {
    return null;
  }

  return { hours, minutes };
}

export function formatTimeValue(
  value: string | undefined,
  displayFormat?: string,
): string {
  const parsed = parseTimeValue(value);
  if (!parsed) {
    return "";
  }

  const date = setMinutes(setHours(new Date(), parsed.hours), parsed.minutes);
  return format(date, displayFormat ?? DEFAULT_TIME_FORMAT, { locale: ptBR });
}

export function toTimeValue(hours: number, minutes: number): string {
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function parseDateTimeValue(
  value: string | undefined,
): Date | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = parse(value, "yyyy-MM-dd'T'HH:mm", new Date());
  return isValid(parsed) ? parsed : undefined;
}

export function formatDateTimeValue(
  value: string | undefined,
  displayFormat?: string,
): string {
  const date = parseDateTimeValue(value);
  if (!date) {
    return "";
  }

  return format(date, displayFormat ?? DEFAULT_DATETIME_FORMAT, {
    locale: ptBR,
  });
}

export function toDateTimeValue(date: Date | undefined): string {
  if (!date || !isValid(date)) {
    return "";
  }

  return format(date, "yyyy-MM-dd'T'HH:mm");
}

export function parseMonthValue(value: string | undefined): Date | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = parse(value, "yyyy-MM", new Date());
  return isValid(parsed) ? startOfMonth(parsed) : undefined;
}

export function parseMonthParts(
  value: string | undefined,
): { month: number; year: number } | null {
  const date = parseMonthValue(value);
  if (!date) {
    return null;
  }

  return {
    month: date.getMonth() + 1,
    year: date.getFullYear(),
  };
}

export function formatMonthValue(
  value: string | undefined,
  displayFormat?: string,
): string {
  const date = parseMonthValue(value);
  if (!date) {
    return "";
  }

  return format(date, displayFormat ?? DEFAULT_MONTH_FORMAT, { locale: ptBR });
}

export function toMonthValue(date: Date | undefined): string {
  if (!date || !isValid(date)) {
    return "";
  }

  return format(startOfMonth(date), "yyyy-MM");
}

export function toMonthValueFromParts(month: number, year: number): string {
  return `${year}-${String(month).padStart(2, "0")}`;
}

export function formatTemporalDisplayValue(
  type: "date" | "time" | "datetime-local" | "month",
  value: string | undefined,
  customFormat?: string,
): string {
  switch (type) {
    case "date":
      return formatDateValue(value, getDisplayFormat(type, customFormat));
    case "time":
      return formatTimeValue(value, getDisplayFormat(type, customFormat));
    case "datetime-local":
      return formatDateTimeValue(value, getDisplayFormat(type, customFormat));
    case "month":
      return formatMonthValue(value, getDisplayFormat(type, customFormat));
  }
}
