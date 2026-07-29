import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import NavBar from './NavBar';

const renderNavBar = () =>
    render(
        <MemoryRouter>
            <NavBar />
        </MemoryRouter>
    );

describe('NavBar', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('shows Login and Register links when not authenticated', () => {
        renderNavBar();
        expect(screen.getByRole('link', { name: /log in/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /register/i })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /log out/i })).not.toBeInTheDocument();
    });

    it('shows Dashboard link and Logout button when authenticated', () => {
        localStorage.setItem('token', 'jwt-token');
        renderNavBar();
        expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /log out/i })).toBeInTheDocument();
        expect(screen.queryByRole('link', { name: /log in/i })).not.toBeInTheDocument();
    });

    it('clears the token on logout click', async () => {
        localStorage.setItem('token', 'jwt-token');
        const user = userEvent.setup();
        renderNavBar();

        await user.click(screen.getByRole('button', { name: /log out/i }));

        expect(localStorage.getItem('token')).toBeNull();
    });
});