import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from './useAuth';

function makeToken(payload: Record<string, unknown>): string {
  const body = btoa(JSON.stringify(payload));
  return `header.${body}.signature`;
}

describe('useAuth', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('starts unauthenticated when there is no stored token', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.token).toBeNull();
  });

  it('picks up an existing token from localStorage on init', () => {
    localStorage.setItem('token', makeToken({ role: 'user' }));
    const { result } = renderHook(() => useAuth());
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('setToken stores the token and marks the user authenticated', () => {
    const { result } = renderHook(() => useAuth());
    act(() => result.current.setToken(makeToken({ role: 'user' })));
    expect(result.current.isAuthenticated).toBe(true);
    expect(localStorage.getItem('token')).not.toBeNull();
  });

  it('logout clears the token and marks the user unauthenticated', () => {
    const { result } = renderHook(() => useAuth());
    act(() => result.current.setToken(makeToken({ role: 'user' })));
    act(() => result.current.logout());
    expect(result.current.isAuthenticated).toBe(false);
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('isAdmin is false when there is no token', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.isAdmin).toBe(false);
  });

  it('isAdmin is false for a non-admin role', () => {
    const { result } = renderHook(() => useAuth());
    act(() => result.current.setToken(makeToken({ role: 'user' })));
    expect(result.current.isAdmin).toBe(false);
  });

  it('isAdmin is true when the token role claim is admin', () => {
    const { result } = renderHook(() => useAuth());
    act(() => result.current.setToken(makeToken({ role: 'admin' })));
    expect(result.current.isAdmin).toBe(true);
  });

  it('isAdmin is false for a malformed token', () => {
    localStorage.setItem('token', 'not-a-real-jwt');
    const { result } = renderHook(() => useAuth());
    expect(result.current.isAdmin).toBe(false);
  });
});