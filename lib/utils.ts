import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ApiResponsePayload<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
    [key: string]: unknown;
  };
}

export function successResponse<T>(data: T, meta?: unknown, status = 200) {
  const payload: ApiResponsePayload<T> = {
    success: true,
    data,
  };
  if (meta) {
    payload.meta = meta as {
      page?: number;
      limit?: number;
      total?: number;
      totalPages?: number;
      [key: string]: unknown;
    };
  }
  return Response.json(payload, { status });
}

export function errorResponse(message: string, status = 400) {
  const payload: ApiResponsePayload = {
    success: false,
    error: message,
  };
  return Response.json(payload, { status });
}
