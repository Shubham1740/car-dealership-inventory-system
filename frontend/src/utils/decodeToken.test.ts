import { describe, it, expect } from 'vitest';
import { decodeToken } from './decodeToken';

function makeToken(payload: Record<string, unknown>): string {
  const body = btoa(JSON.stringify(payload));
  return `header.${body}.signature`;
}

describe('decodeToken', () => {
  it('decodes the payload of a well-formed token', () => {
    const token = makeToken({ role: 'admin', sub: 'user-1' });
    expect(decodeToken(token)).toEqual({ role: 'admin', sub: 'user-1' });
  });

  it('returns null for a malformed token', () => {
    expect(decodeToken('not-a-real-jwt')).toBeNull();
  });

  it('returns null for an empty string', () => {
    expect(decodeToken('')).toBeNull();
  });
});
