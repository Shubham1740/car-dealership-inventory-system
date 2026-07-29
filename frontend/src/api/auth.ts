import apiClient from './client';

interface RegisterPayload {
  email: string;
  password: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

export const register = async (payload: RegisterPayload) => {
  const response = await apiClient.post('/auth/register', payload);
  return response.data;
};

export const login = async (payload: LoginPayload) => {
  const response = await apiClient.post('/auth/login', payload);
  return response.data;
};