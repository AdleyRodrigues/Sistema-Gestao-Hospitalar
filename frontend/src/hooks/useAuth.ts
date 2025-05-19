import { useState, useEffect } from 'react';
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

    // Log para depuração - verificar os dados do usuário no mount do hook
    useEffect(() => {
        console.log('Estado de autenticação:', { isAuthenticated, user });
        console.log('Usuário no localStorage:', localStorage.getItem('@vidaplus:user'));
    }, [isAuthenticated, user]);

    const login = async (email: string, password: string) => {
        try {
            dispatch(loginStart());
            setLoading(true);

            // Chamada à API real
            console.log('Tentando fazer login com:', { email, password });
            const response = await api.post('/login', { email, password });
            console.log('Resposta do login:', response.data);

            // Dados do usuário e token retornados pela API
            const { user: userData, token } = response.data;

            console.log('Dados do usuário recebidos:', userData);

            dispatch(loginSuccess({
                user: userData,
                token
            }));

            // Redirecionar baseado no tipo de usuário
            console.log('Redirecionando baseado na role:', userData.role);
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
            console.error('Erro no login:', error);
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