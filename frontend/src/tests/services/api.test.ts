import { api } from '../../services/api';
import axios from 'axios';

// Mock do axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('API Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve retornar dados de pacientes corretamente', async () => {
        // Mock da resposta do servidor
        const mockPatients = [
            {
                id: 'user2',
                name: 'Carlos Ferreira',
                email: 'carlos@example.com',
                role: 'patient'
            },
            {
                id: 'user4',
                name: 'Maria Silva',
                email: 'maria@example.com',
                role: 'patient'
            }
        ];

        // Configurar o mock do axios para responder com os dados mockados
        mockedAxios.get.mockResolvedValueOnce({ data: mockPatients });

        // Chamar a API
        const result = await api.get('/patients');

        // Verificar se axios.get foi chamado com o endpoint correto
        expect(mockedAxios.get).toHaveBeenCalledWith('/patients');

        // Verificar se retornou os dados esperados
        expect(result.data).toEqual(mockPatients);
        expect(result.data).toHaveLength(2);
        expect(result.data[0].name).toBe('Carlos Ferreira');
    });

    it('deve fazer uma chamada POST corretamente', async () => {
        // Mock da resposta do servidor
        const mockResponse = { success: true, id: 'app123' };

        // Mock da requisição
        const appointmentData = {
            patientId: 'user2',
            professionalId: 'user3',
            date: '2025-05-15T10:30:00.000Z',
            status: 'scheduled',
            type: 'consultation',
            notes: 'Nova consulta'
        };

        // Configurar o mock do axios para responder com os dados mockados
        mockedAxios.post.mockResolvedValueOnce({ data: mockResponse });

        // Chamar a API
        const result = await api.post('/appointments', appointmentData);

        // Verificar se axios.post foi chamado com os argumentos corretos
        expect(mockedAxios.post).toHaveBeenCalledWith('/appointments', appointmentData);

        // Verificar se retornou a resposta esperada
        expect(result.data).toEqual(mockResponse);
        expect(result.data.success).toBe(true);
    });

    it('deve fazer uma chamada PUT corretamente', async () => {
        // Mock da resposta do servidor
        const mockResponse = { success: true };

        // Mock da requisição
        const updatedData = {
            id: 'app1',
            status: 'completed',
            notes: 'Consulta realizada com sucesso'
        };

        // Configurar o mock do axios para responder com os dados mockados
        mockedAxios.put.mockResolvedValueOnce({ data: mockResponse });

        // Chamar a API
        const result = await api.put(`/appointments/${updatedData.id}`, updatedData);

        // Verificar se axios.put foi chamado com os argumentos corretos
        expect(mockedAxios.put).toHaveBeenCalledWith(`/appointments/${updatedData.id}`, updatedData);

        // Verificar se retornou a resposta esperada
        expect(result.data).toEqual(mockResponse);
        expect(result.data.success).toBe(true);
    });

    it('deve lidar com erros de API corretamente', async () => {
        // Configurar o mock do axios para rejeitar com um erro
        const errorMessage = 'Erro de rede';
        mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));

        // Chamar a API e esperar que lance um erro
        await expect(api.get('/invalid-endpoint')).rejects.toThrow(errorMessage);

        // Verificar se axios.get foi chamado com o endpoint correto
        expect(mockedAxios.get).toHaveBeenCalledWith('/invalid-endpoint');
    });
}); 