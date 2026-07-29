import { describe, it, expect } from 'vitest';
import apiClient from './client';

describe('apiClient', () => {
  it('is configured with the correct base URL', () => {
    expect(apiClient.defaults.baseURL).toBe('http://localhost:5000/api');
  });

  it('sends JSON content-type by default', () => {
    expect(apiClient.defaults.headers['Content-Type']).toBe('application/json');
  });
});