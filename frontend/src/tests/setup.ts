import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Necessário para o jsdom
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock para o localStorage
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});

// Mock para a API
jest.mock('../services/api', () => ({
    api: {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
    }
}));

// Limpeza de mocks entre testes
beforeEach(() => {
    jest.clearAllMocks();
}); 