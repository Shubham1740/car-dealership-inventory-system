import { useState } from 'react';
import type { FormEvent } from 'react';
import { register } from '../api/auth';
import { getErrorMessage } from '../utils/getErrorMessage';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        try {
            await register({ email, password });
            setSuccess(true);
            setEmail('');
            setPassword('');
        } catch (err: unknown) {
            setError(getErrorMessage(err));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-md rounded-lg p-8 w-full max-w-sm"
            >
                <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>

                {error && (
                    <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
                )}

                {success && (
                    <p className="text-green-600 text-sm mb-4 text-center">
                        Registration successful! You can now log in.
                    </p>
                )}

                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="password" className="block text-sm font-medium mb-1">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        required
                        minLength={6}
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white rounded py-2 font-medium hover:bg-blue-700"
                >
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register;