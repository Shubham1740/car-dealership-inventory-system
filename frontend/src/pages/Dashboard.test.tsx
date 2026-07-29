import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from './Dashboard';

describe('Dashboard page', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('renders a welcome message', () => {
        render(
            <MemoryRouter>
                <Dashboard />
            </MemoryRouter>
        );
        expect(screen.getByText(/welcome/i)).toBeInTheDocument();
    });

    it('renders a logout button', () => {
        render(
            <MemoryRouter>
                <Dashboard />
            </MemoryRouter>
        );
        expect(screen.getByRole('button', { name: /log out/i })).toBeInTheDocument();
    });

    it('clears the token from localStorage on logout click', async () => {
        localStorage.setItem('token', 'jwt-token');
        const user = userEvent.setup();

        render(
            <MemoryRouter>
                <Dashboard />
            </MemoryRouter>
        );

        await user.click(screen.getByRole('button', { name: /log out/i }));

        expect(localStorage.getItem('token')).toBeNull();
    });
});