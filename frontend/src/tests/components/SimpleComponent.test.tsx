import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Componente simples para teste
const SimpleButton = ({ label, onClick }: { label: string; onClick?: () => void }) => {
    return (
        <button onClick={onClick} data-testid="simple-button">
            {label}
        </button>
    );
};

// Componente com estado
const Counter = () => {
    const [count, setCount] = React.useState(0);

    return (
        <div>
            <p data-testid="count-value">Contagem: {count}</p>
            <button
                onClick={() => setCount(prev => prev + 1)}
                data-testid="increment-button"
            >
                Incrementar
            </button>
        </div>
    );
};

// Testes para o componente SimpleButton
describe('SimpleButton', () => {
    it('deve renderizar o botão com o label correto', () => {
        render(<SimpleButton label="Clique aqui" />);

        const button = screen.getByTestId('simple-button');
        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent('Clique aqui');
    });

    it('deve chamar a função onClick quando clicado', () => {
        const handleClick = jest.fn();
        render(<SimpleButton label="Clique aqui" onClick={handleClick} />);

        const button = screen.getByTestId('simple-button');
        button.click();

        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});

// Testes para o componente Counter
describe('Counter', () => {
    it('deve iniciar com contagem 0', () => {
        render(<Counter />);

        const countValue = screen.getByTestId('count-value');
        expect(countValue).toHaveTextContent('Contagem: 0');
    });

    it('deve incrementar a contagem quando o botão é clicado', () => {
        render(<Counter />);

        const button = screen.getByTestId('increment-button');
        fireEvent.click(button);

        const countValue = screen.getByTestId('count-value');
        expect(countValue).toHaveTextContent('Contagem: 1');
    });
}); 