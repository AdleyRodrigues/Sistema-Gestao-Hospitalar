import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { loginFailure, loginStart, loginSuccess, logout } from '../store/slices/authSlice';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';

export const useAuth = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const { user, isAuthenticated } = useAppSelector((state) => state.auth);

    const login = async (email: string, password: string) => {
        try {
            dispatch(loginStart());
            setLoading(true);

            // Chamada à API real
            const response = await api.post('/api/login', { email, password });

            // Dados do usuário e token retornados pela API
            const { user: userData, token } = response.data;

            dispatch(loginSuccess({
                user: userData,
                token
            }));

            // Redirecionar baseado no tipo de usuário
            if (userData.role === 'admin') {
                navigate('/admin/dashboard');
            } else if (userData.role === 'professional') {
                navigate('/professional/dashboard');
            } else {
                navigate('/patient/dashboard');
            }

            setLoading(false);
            return true;
        } catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'Credenciais inválidas. Tente novamente.';

            dispatch(loginFailure(errorMessage));
            setLoading(false);
            return false;
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return {
        isAuthenticated,
        user,
        login,
        logout: handleLogout,
        loading
    };
}; 