import axios from "axios";

type NestJsErrorBody = {
  message?: string | string[];
};

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!axios.isAxiosError(error)) {
    return fallback;
  }

  const data = error.response?.data as NestJsErrorBody | undefined;
  const message = data?.message;

  if (typeof message === "string" && message.length > 0) {
    return message;
  }

  if (Array.isArray(message) && message.length > 0) {
    return message[0];
  }

  return fallback;
}

export function getApiErrorStatus(error: unknown, fallback = 500): number {
  if (axios.isAxiosError(error)) {
    return error.response?.status ?? fallback;
  }

  return fallback;
}
