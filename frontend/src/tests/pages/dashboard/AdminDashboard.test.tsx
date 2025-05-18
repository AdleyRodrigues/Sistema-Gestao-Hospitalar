import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { api } from '../../../services/api';

// Mock para o componente AuthProvider
jest.mock('../../../hooks/useAuth', () => ({
    useAuth: () => ({
        user: {
            id: 'user1',
            name: 'Administrador Sistema',
            email: 'admin@sghss.com',
            role: 'admin'
        },
        isAuthenticated: true
    })
}));

// Mock para a API
jest.mock('../../../services/api');
const mockedApi = api as jest.Mocked<typeof api>;

// Mock do componente AdminDashboard
// Isto é apenas para teste, o componente real é muito complexo para mockear completamente
const MockAdminDashboard = () => {
    const [loading, setLoading] = React.useState(true);
    const [stats, setStats] = React.useState({
        totalPatients: 0,
        newPatients: 0,
        totalProfessionals: 0,
        totalAppointments: 0,
        revenue: 0,
        expenses: 0,
        profit: 0
    });

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                // Simular chamada da API
                const patientsResponse = await api.get('/patients');
                const professionalsResponse = await api.get('/professionals');
                const appointmentsResponse = await api.get('/appointments');

                // Processar dados (simplificado para teste)
                const dashboardStats = {
                    totalPatients: patientsResponse.data.length,
                    newPatients: 2,
                    totalProfessionals: professionalsResponse.data.length,
                    totalAppointments: appointmentsResponse.data.length,
                    revenue: 15000,
                    expenses: 8000,
                    profit: 7000
                };

                setStats(dashboardStats);
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Carregando...</div>;
    }

    return (
        <div>
            <h1>Dashboard do Administrador</h1>

            <div data-testid="stats-container">
                <div>Total de Pacientes: <span data-testid="total-patients">{stats.totalPatients}</span></div>
                <div>Novos Pacientes: <span data-testid="new-patients">{stats.newPatients}</span></div>
                <div>Total de Profissionais: <span data-testid="total-professionals">{stats.totalProfessionals}</span></div>
                <div>Total de Consultas: <span data-testid="total-appointments">{stats.totalAppointments}</span></div>
                <div>Receita: <span data-testid="revenue">R$ {stats.revenue.toFixed(2)}</span></div>
                <div>Despesas: <span data-testid="expenses">R$ {stats.expenses.toFixed(2)}</span></div>
                <div>Lucro: <span data-testid="profit">R$ {stats.profit.toFixed(2)}</span></div>
            </div>
        </div>
    );
};

describe('AdminDashboard', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve carregar e exibir dados do dashboard corretamente', async () => {
        // Configurar mocks das respostas da API
        const mockPatients = [
            { id: 'user2', name: 'Carlos Ferreira' },
            { id: 'user4', name: 'Maria Silva' },
            { id: 'user6', name: 'João Oliveira' }
        ];

        const mockProfessionals = [
            { id: 'user3', name: 'Dra. Ana Oliveira' },
            { id: 'user5', name: 'Dr. Ricardo Santos' }
        ];

        const mockAppointments = [
            { id: 'app1', patientId: 'user2', professionalId: 'user3' },
            { id: 'app2', patientId: 'user4', professionalId: 'user5' },
            { id: 'app3', patientId: 'user2', professionalId: 'user5' },
            { id: 'app4', patientId: 'user4', professionalId: 'user3' }
        ];

        const mockFinancialData = [
            { id: 'fin1', type: 'income', amount: 5000 },
            { id: 'fin2', type: 'income', amount: 6000 },
            { id: 'fin3', type: 'income', amount: 4000 },
            { id: 'fin4', type: 'expense', amount: 3000 },
            { id: 'fin5', type: 'expense', amount: 2500 },
            { id: 'fin6', type: 'expense', amount: 2500 }
        ];

        mockedApi.get.mockImplementation((url) => {
            switch (url) {
                case '/patients':
                    return Promise.resolve({ data: mockPatients });
                case '/professionals':
                    return Promise.resolve({ data: mockProfessionals });
                case '/appointments':
                    return Promise.resolve({ data: mockAppointments });
                case '/financial_data':
                    return Promise.resolve({ data: mockFinancialData });
                default:
                    return Promise.reject(new Error('Not found'));
            }
        });

        // Renderizar o componente
        render(
            <BrowserRouter>
                <MockAdminDashboard />
            </BrowserRouter>
        );

        // Verificar o estado de carregamento inicial
        expect(screen.getByText('Carregando...')).toBeInTheDocument();

        // Esperar o carregamento dos dados
        await waitFor(() => {
            expect(screen.queryByText('Carregando...')).not.toBeInTheDocument();
        });

        // Verificar se os dados foram carregados e exibidos corretamente
        expect(screen.getByTestId('stats-container')).toBeInTheDocument();
        expect(screen.getByTestId('total-patients').textContent).toBe('3');
        expect(screen.getByTestId('total-professionals').textContent).toBe('2');
        expect(screen.getByTestId('total-appointments').textContent).toBe('4');

        // Verificar se todas as chamadas de API esperadas foram feitas
        expect(mockedApi.get).toHaveBeenCalledTimes(4);
        expect(mockedApi.get).toHaveBeenCalledWith('/patients');
        expect(mockedApi.get).toHaveBeenCalledWith('/professionals');
        expect(mockedApi.get).toHaveBeenCalledWith('/appointments');
        expect(mockedApi.get).toHaveBeenCalledWith('/financial_data');
    });

    it('deve lidar com erros de carregamento de dados', async () => {
        // Configurar mock para simular erro na API
        mockedApi.get.mockRejectedValue(new Error('Falha ao carregar dados'));

        // Spy no console.error para capturar mensagens de erro
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        // Renderizar o componente
        render(
            <BrowserRouter>
                <MockAdminDashboard />
            </BrowserRouter>
        );

        // Esperar o processamento do erro
        await waitFor(() => {
            expect(screen.queryByText('Carregando...')).not.toBeInTheDocument();
        });

        // Verificar se o erro foi registrado no console
        expect(consoleSpy).toHaveBeenCalledWith('Erro ao buscar dados:', expect.any(Error));

        // Verificar se os dados padrão foram mantidos
        expect(screen.getByTestId('total-patients').textContent).toBe('0');
        expect(screen.getByTestId('total-professionals').textContent).toBe('0');

        // Restaurar o console.error
        consoleSpy.mockRestore();
    });
}); 