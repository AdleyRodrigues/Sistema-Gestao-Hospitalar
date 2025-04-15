import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:3001', // URL da API
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('@vidaplus:token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Se receber um erro 401 (não autorizado), deslogar o usuário
        if (error.response?.status === 401) {
            localStorage.removeItem('@vidaplus:token');
            localStorage.removeItem('@vidaplus:user');
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
); 