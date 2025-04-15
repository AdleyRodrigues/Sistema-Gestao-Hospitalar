import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../hooks/useAuth';

// Mock useAuth
jest.mock('../../hooks/useAuth', () => ({
    useAuth: jest.fn(),
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

describe('ProtectedRoute', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve renderizar o componente filho se o usuário estiver autenticado', () => {
        (useAuth as jest.Mock).mockReturnValue({
            isAuthenticated: true,
            user: { role: 'admin' },
        });

        render(
            <MemoryRouter initialEntries={['/admin']}>
                <Routes>
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <div>Conteúdo Protegido</div>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText('Conteúdo Protegido')).toBeInTheDocument();
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('deve redirecionar para /login quando o usuário não está autenticado', () => {
        (useAuth as jest.Mock).mockReturnValue({
            isAuthenticated: false,
            user: null,
        });

        render(
            <MemoryRouter initialEntries={['/admin']}>
                <Routes>
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <div>Conteúdo Protegido</div>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </MemoryRouter>
        );

        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    it('deve redirecionar para /unauthorized quando o usuário não tem a role necessária', () => {
        (useAuth as jest.Mock).mockReturnValue({
            isAuthenticated: true,
            user: { role: 'patient' },
        });

        render(
            <MemoryRouter initialEntries={['/admin']}>
                <Routes>
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <div>Conteúdo Protegido</div>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </MemoryRouter>
        );

        expect(mockNavigate).toHaveBeenCalledWith('/unauthorized');
    });

    it('deve permitir acesso quando o usuário tem uma das roles permitidas', () => {
        (useAuth as jest.Mock).mockReturnValue({
            isAuthenticated: true,
            user: { role: 'professional' },
        });

        render(
            <MemoryRouter initialEntries={['/dashboard']}>
                <Routes>
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute allowedRoles={['admin', 'professional']}>
                                <div>Conteúdo para Administradores e Profissionais</div>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText('Conteúdo para Administradores e Profissionais')).toBeInTheDocument();
        expect(mockNavigate).not.toHaveBeenCalled();
    });
}); 