import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const NavBar = () => {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
            <Link to="/" className="text-lg font-bold text-blue-600">
                Car Dealership
            </Link>

            <div className="flex items-center gap-4">
                {isAuthenticated ? (
                    <>
                        <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">
                            Dashboard
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 text-white rounded px-4 py-2 font-medium hover:bg-red-700"
                        >
                            Log Out
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="text-gray-700 hover:text-blue-600">
                            Log In
                        </Link>
                        <Link to="/register" className="text-gray-700 hover:text-blue-600">
                            Register
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default NavBar;