// Arquivo de configuração para os testes com Jest e RTL
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// Define interfaces que correspondem às APIs nativas
interface ITextEncoder {
    encode(input: string): Uint8Array;
}

interface ITextDecoder {
    decode(input?: Uint8Array): string;
}

// Polyfill para TextEncoder/TextDecoder (necessário para react-router v7)
class TextEncoderPolyfill implements ITextEncoder {
    encode(input: string): Uint8Array {
        const utf8 = unescape(encodeURIComponent(input));
        const result = new Uint8Array(utf8.length);
        for (let i = 0; i < utf8.length; i++) {
            result[i] = utf8.charCodeAt(i);
        }
        return result;
    }
}

class TextDecoderPolyfill implements ITextDecoder {
    decode(input?: Uint8Array): string {
        if (!input) return '';
        const bytes = new Uint8Array(input);
        let result = '';
        for (let i = 0; i < bytes.length; i++) {
            result += String.fromCharCode(bytes[i]);
        }
        return decodeURIComponent(escape(result));
    }
}

global.TextEncoder = TextEncoderPolyfill as unknown as typeof TextEncoder;
global.TextDecoder = TextDecoderPolyfill as unknown as typeof TextDecoder;

// Configurações globais para testes
configure({ testIdAttribute: 'data-testid' });

// Mock para o localStorage
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock para a API
jest.mock('../src/services/api', () => ({
    api: {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
        patch: jest.fn(),
    },
}));

// Mock para react-router-dom para os testes de componentes
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
    useLocation: () => ({ pathname: '/test' }),
}));

// Silencia erros de console durante os testes
console.error = jest.fn();
console.warn = jest.fn(); 