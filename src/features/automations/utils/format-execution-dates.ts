export function formatDisplayDate(iso: string | null): string {
  if (!iso) {
    return "--/--/----";
  }

  return new Intl.DateTimeFormat("pt-BR").format(new Date(iso));
}

export function formatElapsedTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
}

export function computeElapsedSeconds(
  startedAt: string | null,
  finishedAt: string | null,
): number {
  if (!startedAt) {
    return 0;
  }

  const start = new Date(startedAt).getTime();
  const end = finishedAt ? new Date(finishedAt).getTime() : Date.now();

  if (Number.isNaN(start) || Number.isNaN(end) || end < start) {
    return 0;
  }

  return Math.floor((end - start) / 1000);
}
