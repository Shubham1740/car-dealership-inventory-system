import { isAxiosError } from 'axios';

interface ApiErrorResponse {
  success: boolean;
  message: string;
}

export const getErrorMessage = (error: unknown): string => {
  if (isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.message ?? 'Something went wrong. Please try again.';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong. Please try again.';
};