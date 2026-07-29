import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import GuestRoute from './GuestRoute';

const renderWithRoute = (initialPath: string) =>
    render(
        <MemoryRouter initialEntries={[initialPath]}>
            <Routes>
                <Route
                    path="/login"
                    element={
                        <GuestRoute>
                            <div>Login Page</div>
                        </GuestRoute>
                    }
                />
                <Route path="/dashboard" element={<div>Dashboard Content</div>} />
            </Routes>
        </MemoryRouter>
    );

describe('GuestRoute', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('renders children when not authenticated', () => {
        renderWithRoute('/login');
        expect(screen.getByText(/login page/i)).toBeInTheDocument();
    });

    it('redirects to /dashboard when already authenticated', () => {
        localStorage.setItem('token', 'jwt-token');
        renderWithRoute('/login');
        expect(screen.getByText(/dashboard content/i)).toBeInTheDocument();
        expect(screen.queryByText(/login page/i)).not.toBeInTheDocument();
    });
});