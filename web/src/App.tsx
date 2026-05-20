import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import {AuthProvider} from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Home from './pages/Home.tsx';
import Company from './pages/Company.tsx';
import Order from './pages/Order.tsx';
import Login from './pages/Login';

import './index.css';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <Router>
                    <Routes>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/home" element={
                            <ProtectedRoute>
                                <Home/>
                            </ProtectedRoute>
                        }/>
                        <Route path="/companies" element={
                            <ProtectedRoute>
                                <Company/>
                            </ProtectedRoute>
                        }/>
                        <Route path="/orders" element={
                            <ProtectedRoute>
                                <Order/>
                            </ProtectedRoute>
                        }/>
                        <Route path="/" element={<Navigate to="/login" replace/>}/>
                    </Routes>
                </Router>
            </AuthProvider>
        </QueryClientProvider>
    );
}

export default App;
