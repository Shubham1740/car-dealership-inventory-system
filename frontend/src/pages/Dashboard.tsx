import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold">Welcome to your dashboard</h1>
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 text-white rounded px-4 py-2 font-medium hover:bg-red-700"
                    >
                        Log Out
                    </button>
                </div>
                <p className="text-gray-600">Vehicle inventory coming soon.</p>
            </div>
        </div>
    );
};

export default Dashboard;