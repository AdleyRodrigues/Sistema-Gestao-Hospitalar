import { configureStore } from '@reduxjs/toolkit';
import { render, renderHook, RenderOptions } from '@testing-library/react';
import React, { ReactElement, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

// Wrapper simplificado sem ThemeProvider que está causando problemas
export const AllTheProviders = ({ children }: { children: ReactNode }) => {
    // Store mockada simplificada para testes
    const store = configureStore({
        reducer: {
            // Aqui você colocaria seus reducers reais
            test: (state = {}) => state,
            auth: (state = {
                user: null,
                token: null,
                isAuthenticated: false,
                loading: false,
                error: null
            }) => state
        },
    });

    return (
        <Provider store={store}>
            <MemoryRouter>{children}</MemoryRouter>
        </Provider>
    );
};

// Função personalizada de render que inclui os providers
const customRender = (
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Função para testar hooks com os providers
const customRenderHook = <Result, Props>(
    hook: (props: Props) => Result,
    options?: {
        initialProps?: Props;
        wrapper?: React.ComponentType<{ children: ReactNode }>;
    }
) => {
    const wrapper = options?.wrapper || AllTheProviders;
    return renderHook(hook, { ...options, wrapper });
};

// Funções úteis para simular User Events - Substitui o userEvent importado dos testes
export const userEvent = {
    click: (element: HTMLElement) => {
        element.click();
    },
    type: (element: HTMLElement, text: string) => {
        if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
            element.value = text;
            element.dispatchEvent(new Event('change', { bubbles: true }));
        }
    },
    // Adicione mais métodos conforme necessário
};

// Re-exporta tudo do react-testing-library
export * from '@testing-library/react';

// Sobrescreve os métodos
export { customRender as render, customRenderHook as renderHook };
