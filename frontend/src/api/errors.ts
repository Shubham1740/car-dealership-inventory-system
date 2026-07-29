interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const getErrorMessage = (err: unknown, fallback = 'Something went wrong. Please try again.'): string => {
  if (err && typeof err === 'object' && 'response' in err) {
    const apiErr = err as ApiError;
    return apiErr.response?.data?.message || fallback;
  }
  return fallback;
};