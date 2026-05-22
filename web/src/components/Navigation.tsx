import {Link, useLocation, useNavigate} from 'react-router-dom';
import {useAuth} from '../contexts/AuthContext';

const Navigation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {isAuthenticated, logout} = useAuth();
    const currentPage = location.pathname;

    const navItems = [
        {path: '/companies', label: 'Companies'},
        {path: '/drivers', label: 'Drivers'},
        {path: '/vehicles', label: 'Vehicles'},
        {path: '/orders', label: 'Orders'},
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center pt-6">
            <div className="flex items-center bg-gray-300 opacity-95 rounded-full py-3 px-2 shadow-lg">
                {navItems.map((item) => (
                    <div key={item.path} className="mx-2 sm:mx-3">
                        <Link to={item.path}>
                            <h1
                                className={`btn ${
                                    currentPage === item.path
                                        ? "bg-white text-black"
                                        : "bg-transparent text-black"
                                } border-none text-base sm:text-xl px-6 py-3 cursor-pointer hover:bg-white font-semibold rounded-full shadow-none`}
                            >
                                {item.label}
                            </h1>
                        </Link>
                    </div>
                ))}
                {isAuthenticated ? (
                    <div className="mx-2 sm:mx-3">
                        <button
                            onClick={handleLogout}
                            className="btn bg-red-500 text-white border-none text-base sm:text-xl px-6 py-3 cursor-pointer hover:bg-red-600 font-semibold rounded-full shadow-none"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="mx-2 sm:mx-3">
                        <Link to="/login">
                            <h1
                                className={`btn ${
                                    currentPage === "/login"
                                        ? "bg-white text-black"
                                        : "bg-transparent text-black"
                                } border-none text-base sm:text-xl px-6 py-3 cursor-pointer hover:bg-white font-semibold rounded-full shadow-none`}
                            >
                                Login
                            </h1>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navigation;

