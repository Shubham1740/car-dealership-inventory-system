import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ThemeToggle from './ThemeToggle';

const NavBar = () => {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="border-b border-border bg-surface px-6 py-4 flex justify-between items-center">
            <Link to="/" className="font-display text-lg font-semibold text-ink tracking-tight">
                Car Dealership
            </Link>

            <div className="flex items-center gap-4">
                {isAuthenticated ? (
                    <>
                        <Link to="/dashboard" className="text-sm text-muted hover:text-ink transition-colors">
                            Dashboard
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="rounded-md bg-danger px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
                        >
                            Log Out
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="text-sm text-muted hover:text-ink transition-colors">
                            Log In
                        </Link>
                        <Link to="/register" className="text-sm text-muted hover:text-ink transition-colors">
                            Register
                        </Link>
                    </>
                )}
                <ThemeToggle />
            </div>
        </nav>
    );
};

export default NavBar;