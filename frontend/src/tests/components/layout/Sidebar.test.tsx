import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Sidebar } from '../../../components/layout/Sidebar';
import { useAuth } from '../../../hooks/useAuth';
import { UserRole } from '../../../types/auth';

// Mock do hook useAuth
jest.mock('../../../hooks/useAuth', () => ({
    useAuth: jest.fn(),
}));

// Mock para useNavigate e useLocation
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
    useLocation: () => ({ pathname: '/patient/dashboard' }),
}));

describe('Sidebar', () => {
    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();
    });

    it('deve renderizar corretamente para usuários do tipo "patient"', () => {
        (useAuth as jest.Mock).mockReturnValue({
            user: { role: 'patient' as UserRole },
        });

        render(
            <BrowserRouter>
                <Sidebar open={true} width={240} />
            </BrowserRouter>
        );

        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Consultas')).toBeInTheDocument();
        expect(screen.getByText('Histórico Médico')).toBeInTheDocument();
        expect(screen.getByText('Telemedicina')).toBeInTheDocument();
        expect(screen.queryByText('Pacientes')).not.toBeInTheDocument(); // Não deve existir para pacientes
    });

    it('deve renderizar corretamente para usuários do tipo "professional"', () => {
        (useAuth as jest.Mock).mockReturnValue({
            user: { role: 'professional' as UserRole },
        });

        render(
            <BrowserRouter>
                <Sidebar open={true} width={240} />
            </BrowserRouter>
        );

        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Agenda')).toBeInTheDocument();
        expect(screen.getByText('Prontuários')).toBeInTheDocument();
        expect(screen.getByText('Pacientes')).toBeInTheDocument();
        expect(screen.getByText('Telemedicina')).toBeInTheDocument();
        expect(screen.queryByText('Usuários')).not.toBeInTheDocument(); // Não deve existir para profissionais
    });

    it('deve renderizar corretamente para usuários do tipo "admin"', () => {
        (useAuth as jest.Mock).mockReturnValue({
            user: { role: 'admin' as UserRole },
        });

        render(
            <BrowserRouter>
                <Sidebar open={true} width={240} />
            </BrowserRouter>
        );

        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Usuários')).toBeInTheDocument();
        expect(screen.getByText('Profissionais')).toBeInTheDocument();
        expect(screen.getByText('Configurações')).toBeInTheDocument();
        expect(screen.queryByText('Telemedicina')).not.toBeInTheDocument(); // Não deve existir para admins
    });

    it('deve mostrar o botão de Dashboard como implementado', () => {
        (useAuth as jest.Mock).mockReturnValue({
            user: { role: 'patient' as UserRole },
            isAuthenticated: true,
        });

        render(
            <BrowserRouter>
                <Sidebar open={true} width={240} />
            </BrowserRouter>
        );

        // Seleciona todos os botões
        const buttons = screen.getAllByRole('button');
        // O primeiro botão (Dashboard) deve estar habilitado
        expect(buttons[0]).not.toHaveAttribute('aria-disabled', 'true');
        // Os outros botões devem estar desabilitados
        for (let i = 1; i < buttons.length; i++) {
            expect(buttons[i]).toHaveAttribute('aria-disabled', 'true');
        }
    });

    it('deve mostrar ícone de construção para páginas não implementadas', () => {
        (useAuth as jest.Mock).mockReturnValue({
            user: { role: 'patient' as UserRole },
        });

        render(
            <BrowserRouter>
                <Sidebar open={true} width={240} />
            </BrowserRouter>
        );

        // Verifica a presença do ícone de construção (ConstructionRounded)
        // Como o primeiro item (Dashboard) está implementado, ele não deve ter o ícone de construção
        // Mas os outros itens devem ter
        const constructionIcons = document.querySelectorAll('svg[data-testid="ConstructionRoundedIcon"]');
        expect(constructionIcons.length).toBeGreaterThan(0);
    });
}); 