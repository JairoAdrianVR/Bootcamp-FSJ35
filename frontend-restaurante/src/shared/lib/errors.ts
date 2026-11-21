import { ApiError } from "@/shared/types/api";

/**
 * Extrae un mensaje legible de un error de API.
 * Si el error no es un `ApiError` (red, parseo, etc.) devuelve el fallback.
 */
export function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback;
}
