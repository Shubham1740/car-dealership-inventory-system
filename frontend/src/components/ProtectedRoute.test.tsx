import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

const renderWithRoute = (initialPath: string) =>
    render(
        <MemoryRouter initialEntries={[initialPath]}>
            <Routes>
                <Route path="/login" element={<div>Login Page</div>} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <div>Dashboard Content</div>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </MemoryRouter>
    );

describe('ProtectedRoute', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('redirects to /login when not authenticated', () => {
        renderWithRoute('/dashboard');
        expect(screen.getByText(/login page/i)).toBeInTheDocument();
        expect(screen.queryByText(/dashboard content/i)).not.toBeInTheDocument();
    });

    it('renders children when authenticated', () => {
        localStorage.setItem('token', 'jwt-token');
        renderWithRoute('/dashboard');
        expect(screen.getByText(/dashboard content/i)).toBeInTheDocument();
        expect(screen.queryByText(/login page/i)).not.toBeInTheDocument();
    });
});