import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../../pages/auth/Login';
import { useAuth } from '../../hooks/useAuth';

// Mock do hook useAuth
jest.mock('../../hooks/useAuth', () => ({
    useAuth: jest.fn(),
}));

describe('Login Component', () => {
    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();

        // Setup default mock for useAuth
        (useAuth as jest.Mock).mockReturnValue({
            login: jest.fn().mockResolvedValue(true),
            loading: false,
        });
    });

    it('deve renderizar o formulário de login', () => {
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        // Verifica elementos principais
        expect(screen.getByText('VidaPlus')).toBeInTheDocument();
        expect(screen.getByText('Sistema de Gestão Hospitalar')).toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Senha')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
    });

    it('deve mostrar erro quando campos são inválidos', async () => {
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        // Tenta enviar o formulário vazio
        fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

        // Verifica se apareceram mensagens de erro
        await waitFor(() => {
            expect(screen.getByText(/email é obrigatório/i)).toBeInTheDocument();
        });
    });

    it('deve chamar o login quando o formulário é submetido com dados válidos', async () => {
        const mockLogin = jest.fn().mockResolvedValue(true);
        (useAuth as jest.Mock).mockReturnValue({
            login: mockLogin,
            loading: false,
        });

        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        // Preenche os campos
        fireEvent.change(screen.getByLabelText('Email'), {
            target: { value: 'admin@vidaplus.com' },
        });

        fireEvent.change(screen.getByLabelText('Senha'), {
            target: { value: 'senha123456' },
        });

        // Envia o formulário
        fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

        // Verifica se a função login foi chamada com os parâmetros corretos
        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith('admin@vidaplus.com', 'senha123456');
        });
    });

    it('deve mostrar mensagem de erro quando o login falha', async () => {
        const mockLogin = jest.fn().mockResolvedValue(false);
        (useAuth as jest.Mock).mockReturnValue({
            login: mockLogin,
            loading: false,
        });

        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        // Preenche os campos
        fireEvent.change(screen.getByLabelText('Email'), {
            target: { value: 'admin@vidaplus.com' },
        });

        fireEvent.change(screen.getByLabelText('Senha'), {
            target: { value: 'senha123456' },
        });

        // Envia o formulário
        fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

        // Verifica se a mensagem de erro aparece
        await waitFor(() => {
            expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument();
        });
    });

    it('deve desabilitar o botão durante o carregamento', () => {
        (useAuth as jest.Mock).mockReturnValue({
            login: jest.fn(),
            loading: true,
        });

        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        // Verifica se o botão está desabilitado
        expect(screen.getByRole('button', { name: '' })).toBeDisabled();
    });
}); 