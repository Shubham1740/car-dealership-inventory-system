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
        <div className="min-h-[calc(100vh-73px)] bg-bg p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="font-display text-2xl font-semibold text-ink">Welcome to your dashboard</h1>
                        <p className="text-sm text-muted mt-1">Inventory overview</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="rounded-md bg-danger px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
                    >
                        Log Out
                    </button>
                </div>
                <div className="rounded-lg border border-border bg-surface p-6">
                    <p className="text-muted">Vehicle inventory coming soon.</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;