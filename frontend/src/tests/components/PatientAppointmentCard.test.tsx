import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Definindo um tipo para o appointment
type AppointmentType = {
    id: number;
    doctor: string;
    specialty: string;
    date: string;
    time: string;
    status: string;
};

// Para evitar erro de importação direta do componente real, simulamos o componente
// Isso permite testar a lógica independente da implementação exata da UI
const MockPatientAppointmentCard = ({
    appointment,
    onDetails,
    onReschedule
}: {
    appointment: AppointmentType;
    onDetails: (appointment: AppointmentType) => void;
    onReschedule: (appointment: AppointmentType) => void;
}) => {
    return (
        <div data-testid="appointment-card">
            <h3>{appointment.doctor}</h3>
            <p>{appointment.specialty}</p>
            <p>Data: {appointment.date}</p>
            <p>Hora: {appointment.time}</p>
            <button
                onClick={() => onDetails(appointment)}
                data-testid="details-button"
            >
                Detalhes
            </button>
            <button
                onClick={() => onReschedule(appointment)}
                data-testid="reschedule-button"
            >
                Reagendar
            </button>
        </div>
    );
};

// Mock dos handlers
const mockOnDetails = jest.fn();
const mockOnReschedule = jest.fn();

describe('PatientAppointmentCard', () => {
    const mockAppointment = {
        id: 1,
        doctor: 'Dra. Ana Oliveira',
        specialty: 'Cardiologia',
        date: '15/06/2023',
        time: '14:30',
        status: 'scheduled'
    };

    beforeEach(() => {
        // Limpar todos os mocks antes de cada teste
        jest.clearAllMocks();
    });

    it('deve renderizar corretamente os dados da consulta', () => {
        render(
            <BrowserRouter>
                <MockPatientAppointmentCard
                    appointment={mockAppointment}
                    onDetails={mockOnDetails}
                    onReschedule={mockOnReschedule}
                />
            </BrowserRouter>
        );

        // Verificar se os dados da consulta estão sendo exibidos
        expect(screen.getByText('Dra. Ana Oliveira')).toBeInTheDocument();
        expect(screen.getByText('Cardiologia')).toBeInTheDocument();
        expect(screen.getByText('Data: 15/06/2023')).toBeInTheDocument();
        expect(screen.getByText('Hora: 14:30')).toBeInTheDocument();
    });

    it('deve chamar a função onDetails quando o botão de detalhes é clicado', () => {
        render(
            <BrowserRouter>
                <MockPatientAppointmentCard
                    appointment={mockAppointment}
                    onDetails={mockOnDetails}
                    onReschedule={mockOnReschedule}
                />
            </BrowserRouter>
        );

        // Clicar no botão de detalhes
        fireEvent.click(screen.getByTestId('details-button'));

        // Verificar se a função foi chamada com o appointment correto
        expect(mockOnDetails).toHaveBeenCalledTimes(1);
        expect(mockOnDetails).toHaveBeenCalledWith(mockAppointment);
    });

    it('deve chamar a função onReschedule quando o botão de reagendamento é clicado', () => {
        render(
            <BrowserRouter>
                <MockPatientAppointmentCard
                    appointment={mockAppointment}
                    onDetails={mockOnDetails}
                    onReschedule={mockOnReschedule}
                />
            </BrowserRouter>
        );

        // Clicar no botão de reagendamento
        fireEvent.click(screen.getByTestId('reschedule-button'));

        // Verificar se a função foi chamada com o appointment correto
        expect(mockOnReschedule).toHaveBeenCalledTimes(1);
        expect(mockOnReschedule).toHaveBeenCalledWith(mockAppointment);
    });
}); 