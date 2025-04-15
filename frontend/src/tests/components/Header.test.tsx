import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../../components/Header';
import { useAuth } from '../../hooks/useAuth';
import { useAppDispatch } from '../../hooks/useAppDispatch';

// Mock dos hooks
jest.mock('../../hooks/useAuth', () => ({
    useAuth: jest.fn(),
}));

jest.mock('../../hooks/useAppDispatch', () => ({
    useAppDispatch: jest.fn(),
}));

describe('Header', () => {
    const mockDispatch = jest.fn();
    const mockLogout = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
        (useAuth as jest.Mock).mockReturnValue({
            user: { name: 'Teste Usuário', avatar: '/avatar.jpg' },
            logout: mockLogout
        });
    });

    it('deve renderizar o nome do usuário corretamente', () => {
        render(
            <BrowserRouter>
                <Header />
            </BrowserRouter>
        );

        expect(screen.getByText('Teste Usuário')).toBeInTheDocument();
    });

    it('deve mostrar o avatar do usuário', () => {
        render(
            <BrowserRouter>
                <Header />
            </BrowserRouter>
        );

        const avatar = screen.getByAltText('Avatar do usuário');
        expect(avatar).toBeInTheDocument();
        expect(avatar).toHaveAttribute('src', '/avatar.jpg');
    });

    it('deve abrir o menu ao clicar no avatar', () => {
        render(
            <BrowserRouter>
                <Header />
            </BrowserRouter>
        );

        const avatar = screen.getByAltText('Avatar do usuário');
        fireEvent.click(avatar);

        // Verifica se o menu está visível
        expect(screen.getByText('Meu Perfil')).toBeInTheDocument();
        expect(screen.getByText('Sair')).toBeInTheDocument();
    });

    it('deve chamar a função de logout ao clicar em "Sair"', () => {
        render(
            <BrowserRouter>
                <Header />
            </BrowserRouter>
        );

        // Abre o menu
        const avatar = screen.getByAltText('Avatar do usuário');
        fireEvent.click(avatar);

        // Clica em Sair
        const logoutButton = screen.getByText('Sair');
        fireEvent.click(logoutButton);

        // Verifica se a função de logout foi chamada
        expect(mockLogout).toHaveBeenCalledTimes(1);
    });

    it('deve renderizar o título correto', () => {
        render(
            <BrowserRouter>
                <Header />
            </BrowserRouter>
        );

        expect(screen.getByText('Sistema de Gestão Hospitalar')).toBeInTheDocument();
    });

    it('deve exibir ícone de menu', () => {
        render(
            <BrowserRouter>
                <Header />
            </BrowserRouter>
        );

        const menuButton = screen.getByLabelText('menu');
        expect(menuButton).toBeInTheDocument();
    });
}); 