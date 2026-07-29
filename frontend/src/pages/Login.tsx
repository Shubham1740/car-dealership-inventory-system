import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import { getErrorMessage } from '../utils/getErrorMessage';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { setToken } = useAuth();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await login({ email, password });
            setToken(response.data.token);
            navigate('/dashboard');
        } catch (err: unknown) {
            setError(getErrorMessage(err));
        }
    };

    return (
        <div className="min-h-[calc(100vh-73px)] flex items-center justify-center bg-bg px-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm rounded-lg border border-border bg-surface p-8 shadow-sm"
            >
                <h1 className="font-display text-2xl font-semibold text-ink mb-1">Log in</h1>
                <p className="text-sm text-muted mb-6">Access your inventory dashboard.</p>

                {error && (
                    <p className="mb-4 rounded-md bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>
                )}

                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-ink mb-1">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-md border border-border bg-bg px-3 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-accent"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="password" className="block text-sm font-medium text-ink mb-1">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-md border border-border bg-bg px-3 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-accent"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full rounded-md bg-accent py-2 font-medium text-white hover:bg-accent-hover transition-colors"
                >
                    Log In
                </button>
            </form>
        </div>
    );
};

export default Login;