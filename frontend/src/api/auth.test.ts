import { describe, it, expect, vi, beforeEach } from 'vitest';
import apiClient from './client';
import { register, login } from './auth';

vi.mock('./client');

describe('auth API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('register posts to /auth/register and returns the response data', async () => {
    const mockResponse = { data: { success: true, data: { user: { email: 'a@b.com' } } } };
    (apiClient.post as any).mockResolvedValue(mockResponse);

    const result = await register({ email: 'a@b.com', password: 'secret1' });

    expect(apiClient.post).toHaveBeenCalledWith('/auth/register', { email: 'a@b.com', password: 'secret1' });
    expect(result).toEqual(mockResponse.data);
  });

  it('login posts to /auth/login and returns the response data', async () => {
    const mockResponse = { data: { success: true, data: { token: 'jwt-token', user: { email: 'a@b.com' } } } };
    (apiClient.post as any).mockResolvedValue(mockResponse);

    const result = await login({ email: 'a@b.com', password: 'secret1' });

    expect(apiClient.post).toHaveBeenCalledWith('/auth/login', { email: 'a@b.com', password: 'secret1' });
    expect(result).toEqual(mockResponse.data);
  });
});