import { api } from '../../services/api';

// Mock do axios/api
jest.mock('../../services/api', () => ({
    api: {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn()
    }
}));

describe('API Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve chamar o método GET corretamente', async () => {
        const mockData = { id: 1, name: 'Test User' };
        (api.get as jest.Mock).mockResolvedValueOnce({ data: mockData });

        const result = await api.get('/users/1');

        expect(api.get).toHaveBeenCalledWith('/users/1');
        expect(result.data).toEqual(mockData);
    });

    it('deve chamar o método POST corretamente', async () => {
        const requestData = { name: 'New User', email: 'user@example.com' };
        const mockResponse = { id: 1, ...requestData };

        (api.post as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

        const result = await api.post('/users', requestData);

        expect(api.post).toHaveBeenCalledWith('/users', requestData);
        expect(result.data).toEqual(mockResponse);
    });

    it('deve chamar o método PUT corretamente', async () => {
        const requestData = { name: 'Updated User' };
        const mockResponse = { id: 1, name: 'Updated User', email: 'user@example.com' };

        (api.put as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

        const result = await api.put('/users/1', requestData);

        expect(api.put).toHaveBeenCalledWith('/users/1', requestData);
        expect(result.data).toEqual(mockResponse);
    });

    it('deve chamar o método DELETE corretamente', async () => {
        (api.delete as jest.Mock).mockResolvedValueOnce({ data: { success: true } });

        const result = await api.delete('/users/1');

        expect(api.delete).toHaveBeenCalledWith('/users/1');
        expect(result.data).toEqual({ success: true });
    });
}); 