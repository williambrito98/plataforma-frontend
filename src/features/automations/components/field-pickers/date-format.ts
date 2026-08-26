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

const SAMPLE_DATE = new Date(2026, 7, 25);

const MONTH_TOKENS = new Set([
  "M",
  "MM",
  "MMM",
  "MMMM",
  "L",
  "LL",
  "LLL",
  "LLLL",
]);
const YEAR_TOKENS = new Set([
  "y",
  "yy",
  "yyy",
  "yyyy",
  "Y",
  "YY",
  "YYY",
  "YYYY",
]);
const DAY_TOKENS = new Set(["d", "dd"]);

function extractFormatTokens(formatStr: string): string[] {
  const tokens: string[] = [];
  let index = 0;

  while (index < formatStr.length) {
    const char = formatStr[index];

    if (char === "'") {
      index += 1;
      while (index < formatStr.length && formatStr[index] !== "'") {
        index += 1;
      }
      index += 1;
      continue;
    }

    if (/[a-zA-Z]/.test(char)) {
      let end = index + 1;
      while (end < formatStr.length && formatStr[end] === char) {
        end += 1;
      }
      tokens.push(formatStr.slice(index, end));
      index = end;
      continue;
    }

    index += 1;
  }

  return tokens;
}

function hasFormatToken(tokens: string[], allowed: Set<string>): boolean {
  return tokens.some((token) => allowed.has(token));
}

export function getDefaultTemporalFormat(type: "date" | "month"): string {
  return type === "date" ? DEFAULT_DATE_FORMAT : DEFAULT_MONTH_FORMAT;
}

export function getTemporalFormatValidationError(
  type: "date" | "month",
  formatStr: string,
): string | null {
  const trimmed = formatStr.trim();
  if (!trimmed) {
    return "Informe o formato do campo.";
  }

  const tokens = extractFormatTokens(trimmed);
  if (tokens.length === 0) {
    return "O formato deve conter tokens date-fns (ex.: MM, yyyy, dd).";
  }

  const allowedTokens =
    type === "month"
      ? new Set([...MONTH_TOKENS, ...YEAR_TOKENS])
      : new Set([...DAY_TOKENS, ...MONTH_TOKENS, ...YEAR_TOKENS]);

  const invalidToken = tokens.find((token) => !allowedTokens.has(token));
  if (invalidToken) {
    return `Token "${invalidToken}" não é permitido para o tipo ${type === "month" ? "mês" : "data"}.`;
  }

  if (!hasFormatToken(tokens, MONTH_TOKENS)) {
    return "O formato deve incluir o mês (ex.: MM ou M).";
  }

  if (!hasFormatToken(tokens, YEAR_TOKENS)) {
    return "O formato deve incluir o ano (ex.: yyyy).";
  }

  if (type === "date" && !hasFormatToken(tokens, DAY_TOKENS)) {
    return "O formato deve incluir o dia (ex.: dd).";
  }

  try {
    const formatted = format(SAMPLE_DATE, trimmed, { locale: ptBR });
    const parsed = parse(formatted, trimmed, SAMPLE_DATE, { locale: ptBR });

    if (!isValid(parsed)) {
      return "Formato inválido: não foi possível interpretar a data formatada.";
    }

    if (
      parsed.getFullYear() !== SAMPLE_DATE.getFullYear() ||
      parsed.getMonth() !== SAMPLE_DATE.getMonth()
    ) {
      return "Formato inválido: mês/ano não correspondem após formatação.";
    }

    if (type === "date" && parsed.getDate() !== SAMPLE_DATE.getDate()) {
      return "Formato inválido: dia não corresponde após formatação.";
    }
  } catch {
    return "Formato inválido: sintaxe não reconhecida pelo date-fns.";
  }

  return null;
}

export function isValidTemporalFormat(
  type: "date" | "month",
  formatStr: string,
): boolean {
  return getTemporalFormatValidationError(type, formatStr) === null;
}

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
