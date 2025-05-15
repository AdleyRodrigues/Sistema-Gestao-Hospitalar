import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: string[];
}

// Este é um mock do componente ProtectedRoute
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const { user, isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        // Redireciona para login se não estiver autenticado
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Verifica se o papel do usuário está na lista de papéis permitidos
    if (user && !allowedRoles.includes(user.role)) {
        // Redireciona para o dashboard apropriado
        return <Navigate to={`/${user.role}/dashboard`} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute; 