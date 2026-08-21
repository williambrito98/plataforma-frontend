const APP_TIMEZONE = "America/Sao_Paulo";

function getDateTimePart(
  parts: Intl.DateTimeFormatPart[],
  type: Intl.DateTimeFormatPartTypes,
): string {
  return parts.find((part) => part.type === type)?.value ?? "00";
}

export function formatFileDate(isoDate: string): string {
  const parts = new Intl.DateTimeFormat("pt-BR", {
    timeZone: APP_TIMEZONE,
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date(isoDate));

  const day = getDateTimePart(parts, "day");
  const month = getDateTimePart(parts, "month");
  const year = getDateTimePart(parts, "year");
  const hours = getDateTimePart(parts, "hour");
  const minutes = getDateTimePart(parts, "minute");

  return `${day}/${month}/${year} - ${hours}:${minutes}`;
}
