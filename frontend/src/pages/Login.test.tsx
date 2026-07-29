import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';
import * as authApi from '../api/auth';

vi.mock('../api/auth');

const renderLogin = () =>
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

describe('Login page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders email and password fields with a submit button', () => {
    renderLogin();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  it('calls login API with entered credentials on submit', async () => {
    const user = userEvent.setup();
    (authApi.login as any).mockResolvedValue({
      success: true,
      data: { token: 'jwt-token', user: { email: 'a@b.com' } },
    });

    renderLogin();
    await user.type(screen.getByLabelText(/email/i), 'a@b.com');
    await user.type(screen.getByLabelText(/password/i), 'secret1');
    await user.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(authApi.login).toHaveBeenCalledWith({ email: 'a@b.com', password: 'secret1' });
    });
  });

  it('stores the token in localStorage on successful login', async () => {
    const user = userEvent.setup();
    (authApi.login as any).mockResolvedValue({
      success: true,
      data: { token: 'jwt-token', user: { email: 'a@b.com' } },
    });

    renderLogin();
    await user.type(screen.getByLabelText(/email/i), 'a@b.com');
    await user.type(screen.getByLabelText(/password/i), 'secret1');
    await user.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('jwt-token');
    });
  });

  it('shows an error message on failed login', async () => {
    const user = userEvent.setup();
    (authApi.login as any).mockRejectedValue({
      response: { data: { success: false, message: 'Invalid credentials' } },
    });

    renderLogin();
    await user.type(screen.getByLabelText(/email/i), 'a@b.com');
    await user.type(screen.getByLabelText(/password/i), 'wrongpass');
    await user.click(screen.getByRole('button', { name: /log in/i }));

    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
  });
});