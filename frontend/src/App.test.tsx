import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

const renderAt = (path: string) =>
    render(
        <MemoryRouter initialEntries={[path]}>
            <App />
        </MemoryRouter>
    );

describe('App routing', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('renders Login page at /login', () => {
        renderAt('/login');
        expect(screen.getByRole('heading', { name: /log in/i })).toBeInTheDocument();
    });

    it('renders Register page at /register', () => {
        renderAt('/register');
        expect(screen.getByRole('heading', { name: /register/i })).toBeInTheDocument();
    });

    it('redirects unknown paths to /login', () => {
        renderAt('/some-nonexistent-path');
        expect(screen.getByRole('heading', { name: /log in/i })).toBeInTheDocument();
    });

    it('redirects root path to /login', () => {
        renderAt('/');
        expect(screen.getByRole('heading', { name: /log in/i })).toBeInTheDocument();
    });

    it('redirects /dashboard to /login when not authenticated', () => {
        renderAt('/dashboard');
        expect(screen.getByRole('heading', { name: /log in/i })).toBeInTheDocument();
    });

    it('renders Dashboard at /dashboard when authenticated', () => {
        localStorage.setItem('token', 'jwt-token');
        renderAt('/dashboard');
        expect(screen.getByText(/welcome to your dashboard/i)).toBeInTheDocument();
    });
});