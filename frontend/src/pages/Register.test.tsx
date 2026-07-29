import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Register from './Register';
import * as authApi from '../api/auth';

vi.mock('../api/auth');

const renderRegister = () =>
    render(
        <MemoryRouter>
            <Register />
        </MemoryRouter>
    );

describe('Register page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders email and password fields with a submit button', () => {
        renderRegister();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
    });

    it('calls register API with entered credentials on submit', async () => {
        const user = userEvent.setup();
        vi.mocked(authApi.register).mockResolvedValue({
            success: true,
            data: { user: { email: 'a@b.com' } },
        });

        renderRegister();
        await user.type(screen.getByLabelText(/email/i), 'a@b.com');
        await user.type(screen.getByLabelText(/password/i), 'secret1');
        await user.click(screen.getByRole('button', { name: /register/i }));

        await waitFor(() => {
            expect(authApi.register).toHaveBeenCalledWith({ email: 'a@b.com', password: 'secret1' });
        });
    });

    it('shows a success message and does not throw on successful registration', async () => {
        const user = userEvent.setup();
        vi.mocked(authApi.register).mockResolvedValue({
            success: true,
            data: { user: { email: 'a@b.com' } },
        });

        renderRegister();
        await user.type(screen.getByLabelText(/email/i), 'a@b.com');
        await user.type(screen.getByLabelText(/password/i), 'secret1');
        await user.click(screen.getByRole('button', { name: /register/i }));

        expect(await screen.findByText(/registration successful/i)).toBeInTheDocument();
    });

    it('shows an error message on duplicate email (409)', async () => {
        const user = userEvent.setup();
        (authApi.register as any).mockRejectedValue({
            isAxiosError: true,
            response: { data: { success: false, message: 'Email already in use' } },
        });

        renderRegister();
        await user.type(screen.getByLabelText(/email/i), 'a@b.com');
        await user.type(screen.getByLabelText(/password/i), 'secret1');
        await user.click(screen.getByRole('button', { name: /register/i }));

        expect(await screen.findByText(/email already in use/i)).toBeInTheDocument();
    });
});