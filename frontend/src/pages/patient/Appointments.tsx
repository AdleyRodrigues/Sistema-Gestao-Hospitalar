import {
    AccessTime,
    CalendarMonth,
    Cancel,
    Event,
    EventAvailable,
    EventBusy,
    MedicalServices,
    Person,
    VideoCameraFront
} from '@mui/icons-material';
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    Snackbar,
    Tab,
    Tabs,
    TextField,
    Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { addDays, differenceInCalendarDays, format, isAfter, isBefore } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/api';

// Tipos
interface Professional {
    id: string;
    name: string;
    email: string;
    role: string;
    specialty: string;
    availableDays: number[]; // 0 = domingo, 1 = segunda, ...
    startTime: string;
    endTime: string;
    appointmentDuration: number; // minutos
}

interface Appointment {
    id: string;
    patientId: string;
    professionalId: string;
    date: string;
    status: 'scheduled' | 'completed' | 'cancelled';
    type: 'consultation' | 'return' | 'telemedicine';
    notes?: string;
    professional?: Professional;
}

// Componente estilizado para cards de horários
const TimeSlotCard = styled(Card)<{ selected?: boolean }>(({ theme, selected }) => ({
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: selected ? `1px solid ${theme.palette.primary.main}` : '1px solid rgba(0, 0, 0, 0.12)',
    backgroundColor: selected ? theme.palette.primary.light : theme.palette.background.paper,
    color: selected ? theme.palette.primary.contrastText : theme.palette.text.primary,
    '&:hover': {
        transform: selected ? 'scale(1.03)' : 'scale(1.02)',
        boxShadow: selected ? theme.shadows[4] : theme.shadows[2],
    },
}));

const statusLabels: Record<string, { label: string, color: 'success' | 'error' | 'warning' | 'info' }> = {
    'scheduled': { label: 'Agendada', color: 'success' },
    'completed': { label: 'Realizada', color: 'info' },
    'cancelled': { label: 'Cancelada', color: 'error' }
};

const PatientAppointments = () => {
    const { user } = useAuth();
    const [tabValue, setTabValue] = useState(0);
    const [loading, setLoading] = useState(false);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [professionals, setProfessionals] = useState<Professional[]>([]);
    const [openNewAppointmentDialog, setOpenNewAppointmentDialog] = useState(false);
    const [openCancelDialog, setOpenCancelDialog] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error' | 'info' | 'warning'
    });

    // Estado para o novo agendamento
    const [newAppointment, setNewAppointment] = useState({
        professionalId: '',
        date: new Date(),
        time: new Date(),
        type: 'consultation' as 'consultation' | 'return' | 'telemedicine',
        notes: ''
    });

    // Estado para disponibilidade dos profissionais
    const [availableTimeSlots, setAvailableTimeSlots] = useState<Date[]>([]);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<Date | null>(null);

    // Estados para validação de formulário
    const [formErrors, setFormErrors] = useState({
        professionalId: '',
        date: '',
        timeSlot: ''
    });

    // Carrega dados ao iniciar
    useEffect(() => {
        if (user) {
            fetchAppointments();
            fetchProfessionals();
        }
    }, [user]);

    // Carrega horários disponíveis quando seleciona profissional e data
    useEffect(() => {
        if (newAppointment.professionalId && newAppointment.date) {
            calculateAvailableTimeSlots();
        } else {
            setAvailableTimeSlots([]);
            setSelectedTimeSlot(null);
        }
    }, [newAppointment.professionalId, newAppointment.date]);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/appointments?patientId=${user?.id}&_expand=professional`);

            // Ordenar por data (futuras primeiro, depois por data)
            const sortedAppointments = response.data.sort((a: Appointment, b: Appointment) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                const now = new Date();

                // Verifica se são futuras ou passadas
                const aIsFuture = isAfter(dateA, now);
                const bIsFuture = isAfter(dateB, now);

                // Se uma é futura e outra passada
                if (aIsFuture && !bIsFuture) return -1;
                if (!aIsFuture && bIsFuture) return 1;

                // Se ambas são futuras ou ambas são passadas, ordena por data
                return dateA.getTime() - dateB.getTime();
            });

            setAppointments(sortedAppointments);
        } catch (error) {
            console.error('Erro ao buscar consultas:', error);
            showSnackbar('Erro ao carregar suas consultas', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchProfessionals = async () => {
        try {
            const response = await api.get('/professionals');
            setProfessionals(response.data);
        } catch (error) {
            console.error('Erro ao buscar profissionais:', error);
            showSnackbar('Erro ao carregar lista de profissionais', 'error');
        }
    };

    const calculateAvailableTimeSlots = () => {
        // Encontra o profissional selecionado
        const professional = professionals.find(p => p.id === newAppointment.professionalId);
        if (!professional) return;

        const selectedDate = new Date(newAppointment.date);
        const dayOfWeek = selectedDate.getDay(); // 0 = domingo, 1 = segunda, ...

        // Verifica se o profissional atende nesse dia da semana
        if (!professional.availableDays.includes(dayOfWeek)) {
            setAvailableTimeSlots([]);
            setFormErrors(prev => ({ ...prev, date: 'Profissional não atende neste dia' }));
            return;
        } else {
            setFormErrors(prev => ({ ...prev, date: '' }));
        }

        // Calcula horários disponíveis
        const slots: Date[] = [];
        const [startHour, startMinute] = professional.startTime.split(':').map(Number);
        const [endHour, endMinute] = professional.endTime.split(':').map(Number);

        const currentSlot = new Date(selectedDate);
        currentSlot.setHours(startHour, startMinute, 0, 0);

        const endTime = new Date(selectedDate);
        endTime.setHours(endHour, endMinute, 0, 0);

        // Adiciona slots de acordo com a duração das consultas
        while (currentSlot < endTime) {
            slots.push(new Date(currentSlot));
            currentSlot.setMinutes(currentSlot.getMinutes() + professional.appointmentDuration);
        }

        // Simulação: remover horários já ocupados
        // Em uma implementação real, você consultaria a API para verificar horários já ocupados
        const occupiedSlots: Date[] = [];
        // Simula alguns horários ocupados aleatoriamente
        slots.forEach((slot, index) => {
            if (index % 3 === 0) { // A cada 3 slots, um está ocupado (apenas simulação)
                occupiedSlots.push(slot);
            }
        });

        const availableSlots = slots.filter(slot =>
            !occupiedSlots.some(occupied =>
                occupied.getHours() === slot.getHours() &&
                occupied.getMinutes() === slot.getMinutes()
            )
        );

        setAvailableTimeSlots(availableSlots);
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleOpenNewAppointmentDialog = () => {
        setNewAppointment({
            professionalId: '',
            date: new Date(),
            time: new Date(),
            type: 'consultation',
            notes: ''
        });
        setSelectedTimeSlot(null);
        setFormErrors({ professionalId: '', date: '', timeSlot: '' });
        setOpenNewAppointmentDialog(true);
    };

    const handleCloseNewAppointmentDialog = () => {
        setOpenNewAppointmentDialog(false);
    };

    const handleOpenCancelDialog = (appointment: Appointment) => {
        setSelectedAppointment(appointment);
        setOpenCancelDialog(true);
    };

    const handleCloseCancelDialog = () => {
        setOpenCancelDialog(false);
        setSelectedAppointment(null);
    };

    const handleProfessionalChange = (event: SelectChangeEvent) => {
        const professionalId = event.target.value as string;
        setNewAppointment(prev => ({ ...prev, professionalId }));
        setFormErrors(prev => ({ ...prev, professionalId: '' }));
    };

    const handleDateChange = (date: Date | null) => {
        if (date) {
            // Verifica se a data é anterior ao dia atual
            if (isBefore(date, new Date())) {
                setFormErrors(prev => ({ ...prev, date: 'Não é possível agendar para datas passadas' }));
                return;
            }

            // Verifica se a data é mais de 60 dias no futuro
            if (differenceInCalendarDays(date, new Date()) > 60) {
                setFormErrors(prev => ({ ...prev, date: 'Não é possível agendar para mais de 60 dias no futuro' }));
                return;
            }

            setNewAppointment(prev => ({ ...prev, date }));
            setFormErrors(prev => ({ ...prev, date: '' }));
        }
    };

    const handleAppointmentTypeChange = (event: SelectChangeEvent) => {
        const type = event.target.value as 'consultation' | 'return' | 'telemedicine';
        setNewAppointment(prev => ({ ...prev, type }));
    };

    const handleNotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewAppointment(prev => ({ ...prev, notes: event.target.value }));
    };

    const handleTimeSlotSelection = (slot: Date) => {
        setSelectedTimeSlot(slot);
        setFormErrors(prev => ({ ...prev, timeSlot: '' }));
    };

    const validateForm = (): boolean => {
        let isValid = true;
        const errors = { professionalId: '', date: '', timeSlot: '' };

        if (!newAppointment.professionalId) {
            errors.professionalId = 'Selecione um profissional';
            isValid = false;
        }

        if (!newAppointment.date) {
            errors.date = 'Selecione uma data';
            isValid = false;
        }

        if (!selectedTimeSlot) {
            errors.timeSlot = 'Selecione um horário disponível';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleCreateAppointment = async () => {
        if (!validateForm() || !selectedTimeSlot) return;

        setLoading(true);
        try {
            // Combina a data e hora selecionadas
            const appointmentDateTime = new Date(newAppointment.date);
            appointmentDateTime.setHours(
                selectedTimeSlot.getHours(),
                selectedTimeSlot.getMinutes(),
                0,
                0
            );

            const appointmentData = {
                patientId: user?.id,
                professionalId: newAppointment.professionalId,
                date: appointmentDateTime.toISOString(),
                status: 'scheduled',
                type: newAppointment.type,
                notes: newAppointment.notes
            };

            // Cria o agendamento
            await api.post('/appointments', appointmentData);

            showSnackbar('Consulta agendada com sucesso!', 'success');
            handleCloseNewAppointmentDialog();
            fetchAppointments(); // Atualiza a lista de agendamentos
        } catch (error) {
            console.error('Erro ao agendar consulta:', error);
            showSnackbar('Erro ao agendar consulta', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelAppointment = async () => {
        if (!selectedAppointment) return;

        setLoading(true);
        try {
            // Atualiza o status para cancelado
            await api.patch(`/appointments/${selectedAppointment.id}`, {
                status: 'cancelled'
            });

            showSnackbar('Consulta cancelada com sucesso!', 'success');
            handleCloseCancelDialog();
            fetchAppointments(); // Atualiza a lista de agendamentos
        } catch (error) {
            console.error('Erro ao cancelar consulta:', error);
            showSnackbar('Erro ao cancelar consulta', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
        setSnackbar({
            open: true,
            message,
            severity
        });
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const formatAppointmentType = (type: string) => {
        switch (type) {
            case 'consultation':
                return 'Consulta';
            case 'return':
                return 'Retorno';
            case 'telemedicine':
                return 'Teleconsulta';
            default:
                return type;
        }
    };

    // Filtra consultas para as diferentes abas
    const upcomingAppointments = appointments.filter(
        appointment => appointment.status === 'scheduled' &&
            isAfter(new Date(appointment.date), new Date())
    );

    const pastAppointments = appointments.filter(
        appointment => appointment.status === 'completed' ||
            (appointment.status === 'scheduled' && isBefore(new Date(appointment.date), new Date()))
    );

    const cancelledAppointments = appointments.filter(
        appointment => appointment.status === 'cancelled'
    );

    // Renderização de card de consulta
    const renderAppointmentCard = (appointment: Appointment) => {
        const appointmentDate = new Date(appointment.date);
        const isPast = isBefore(appointmentDate, new Date());
        const canCancel = appointment.status === 'scheduled' && !isPast;
        const professional = appointment.professional || { name: 'Profissional não identificado', specialty: 'Especialidade não especificada' };

        return (
            <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={8}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                                    {appointment.type === 'telemedicine' ? <VideoCameraFront /> : <MedicalServices />}
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" gutterBottom>
                                        {formatAppointmentType(appointment.type)}
                                        {appointment.type === 'return' && ' - Retorno'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        <Person sx={{ fontSize: '0.9rem', verticalAlign: 'middle', mr: 0.5 }} />
                                        {professional.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        <MedicalServices sx={{ fontSize: '0.9rem', verticalAlign: 'middle', mr: 0.5 }} />
                                        {professional.specialty}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', sm: 'flex-end' } }}>
                                <Chip
                                    label={statusLabels[appointment.status]?.label || appointment.status}
                                    color={statusLabels[appointment.status]?.color || 'default'}
                                    size="small"
                                    sx={{ mb: 1 }}
                                />
                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                    <CalendarMonth fontSize="small" sx={{ mr: 0.5 }} />
                                    {format(appointmentDate, 'dd/MM/yyyy', { locale: ptBR })}
                                </Typography>
                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                                    <AccessTime fontSize="small" sx={{ mr: 0.5 }} />
                                    {format(appointmentDate, 'HH:mm', { locale: ptBR })}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    {appointment.notes && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                <strong>Observações:</strong>
                            </Typography>
                            <Typography variant="body2">
                                {appointment.notes}
                            </Typography>
                        </Box>
                    )}

                    {appointment.type === 'telemedicine' && (
                        <Box sx={{ mt: 2 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<VideoCameraFront />}
                                fullWidth
                                disabled={isPast || appointment.status !== 'scheduled'}
                                onClick={() => {
                                    // Em uma implementação real, esta ação abriria a interface de teleconsulta
                                    showSnackbar('Redirecionando para a sala de teleconsulta...', 'info');
                                }}
                            >
                                {isPast ? 'Consulta Finalizada' : 'Entrar na Teleconsulta'}
                            </Button>
                        </Box>
                    )}

                    {canCancel && (
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<Cancel />}
                                onClick={() => handleOpenCancelDialog(appointment)}
                            >
                                Cancelar Consulta
                            </Button>
                        </Box>
                    )}
                </CardContent>
            </Card>
        );
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Minhas Consultas
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Gerencie suas consultas agendadas e histórico de atendimentos.
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Event />}
                    onClick={handleOpenNewAppointmentDialog}
                >
                    Agendar Nova Consulta
                </Button>
            </Box>

            <Paper sx={{ mb: 4 }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    indicatorColor="primary"
                    textColor="primary"
                >
                    <Tab
                        icon={<EventAvailable sx={{ mr: 1 }} />}
                        label={`Próximas (${upcomingAppointments.length})`}
                        iconPosition="start"
                    />
                    <Tab
                        icon={<Event sx={{ mr: 1 }} />}
                        label={`Realizadas (${pastAppointments.length})`}
                        iconPosition="start"
                    />
                    <Tab
                        icon={<EventBusy sx={{ mr: 1 }} />}
                        label={`Canceladas (${cancelledAppointments.length})`}
                        iconPosition="start"
                    />
                </Tabs>

                <Box sx={{ p: 3 }}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Box>
                            {/* Aba de consultas próximas */}
                            <Box role="tabpanel" hidden={tabValue !== 0}>
                                {upcomingAppointments.length > 0 ? (
                                    upcomingAppointments.map(appointment => (
                                        <Box key={appointment.id} sx={{ mb: 2 }}>
                                            {renderAppointmentCard(appointment)}
                                        </Box>
                                    ))
                                ) : (
                                    <Box sx={{ py: 3, textAlign: 'center' }}>
                                        <Typography variant="body1" color="text.secondary">
                                            Você não tem consultas agendadas.
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            startIcon={<Event />}
                                            onClick={handleOpenNewAppointmentDialog}
                                            sx={{ mt: 2 }}
                                        >
                                            Agendar Consulta
                                        </Button>
                                    </Box>
                                )}
                            </Box>

                            {/* Aba de consultas realizadas */}
                            <Box role="tabpanel" hidden={tabValue !== 1}>
                                {pastAppointments.length > 0 ? (
                                    pastAppointments.map(appointment => (
                                        <Box key={appointment.id} sx={{ mb: 2 }}>
                                            {renderAppointmentCard(appointment)}
                                        </Box>
                                    ))
                                ) : (
                                    <Box sx={{ py: 3, textAlign: 'center' }}>
                                        <Typography variant="body1" color="text.secondary">
                                            Você ainda não realizou nenhuma consulta.
                                        </Typography>
                                    </Box>
                                )}
                            </Box>

                            {/* Aba de consultas canceladas */}
                            <Box role="tabpanel" hidden={tabValue !== 2}>
                                {cancelledAppointments.length > 0 ? (
                                    cancelledAppointments.map(appointment => (
                                        <Box key={appointment.id} sx={{ mb: 2 }}>
                                            {renderAppointmentCard(appointment)}
                                        </Box>
                                    ))
                                ) : (
                                    <Box sx={{ py: 3, textAlign: 'center' }}>
                                        <Typography variant="body1" color="text.secondary">
                                            Você não tem consultas canceladas.
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    )}
                </Box>
            </Paper>

            {/* Modal para agendar nova consulta */}
            <Dialog
                open={openNewAppointmentDialog}
                onClose={handleCloseNewAppointmentDialog}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    Agendar Nova Consulta
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth error={!!formErrors.professionalId}>
                                <InputLabel id="professional-select-label">Profissional</InputLabel>
                                <Select
                                    labelId="professional-select-label"
                                    id="professional-select"
                                    value={newAppointment.professionalId}
                                    onChange={handleProfessionalChange}
                                    label="Profissional"
                                >
                                    {professionals.map(professional => (
                                        <MenuItem key={professional.id} value={professional.id}>
                                            {professional.name} - {professional.specialty}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {formErrors.professionalId && (
                                    <FormHelperText>{formErrors.professionalId}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel id="appointment-type-label">Tipo de Consulta</InputLabel>
                                <Select
                                    labelId="appointment-type-label"
                                    id="appointment-type"
                                    value={newAppointment.type}
                                    onChange={handleAppointmentTypeChange}
                                    label="Tipo de Consulta"
                                >
                                    <MenuItem value="consultation">Consulta</MenuItem>
                                    <MenuItem value="return">Retorno</MenuItem>
                                    <MenuItem value="telemedicine">Teleconsulta</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                                <Box sx={{ width: '100%' }}>
                                    <DatePicker
                                        label="Data da Consulta"
                                        value={newAppointment.date}
                                        onChange={handleDateChange}
                                        minDate={new Date()}
                                        maxDate={addDays(new Date(), 60)}
                                        sx={{ width: '100%' }}
                                        slotProps={{
                                            textField: {
                                                error: !!formErrors.date,
                                                helperText: formErrors.date
                                            }
                                        }}
                                    />
                                </Box>
                            </LocalizationProvider>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="subtitle1" gutterBottom>
                                Horários Disponíveis
                            </Typography>
                            {formErrors.timeSlot && (
                                <FormHelperText error>{formErrors.timeSlot}</FormHelperText>
                            )}
                            {newAppointment.professionalId && newAppointment.date ? (
                                availableTimeSlots.length > 0 ? (
                                    <Grid container spacing={1}>
                                        {availableTimeSlots.map((slot, index) => (
                                            <Grid item xs={6} sm={4} md={3} key={index}>
                                                <TimeSlotCard
                                                    selected={selectedTimeSlot?.getTime() === slot.getTime()}
                                                    onClick={() => handleTimeSlotSelection(slot)}
                                                >
                                                    <CardContent sx={{ textAlign: 'center', py: 1 }}>
                                                        <Typography variant="body1">
                                                            {format(slot, 'HH:mm')}
                                                        </Typography>
                                                    </CardContent>
                                                </TimeSlotCard>
                                            </Grid>
                                        ))}
                                    </Grid>
                                ) : (
                                    <Alert severity="info" sx={{ mt: 1 }}>
                                        Nenhum horário disponível para a data selecionada. Por favor, escolha outra data.
                                    </Alert>
                                )
                            ) : (
                                <Alert severity="info" sx={{ mt: 1 }}>
                                    Selecione um profissional e uma data para ver os horários disponíveis.
                                </Alert>
                            )}
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Observações (opcional)"
                                multiline
                                rows={3}
                                value={newAppointment.notes}
                                onChange={handleNotesChange}
                                placeholder="Descreva brevemente o motivo da sua consulta ou informações relevantes para o profissional"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseNewAppointmentDialog} color="inherit">
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleCreateAppointment}
                        variant="contained"
                        color="primary"
                        disabled={!newAppointment.professionalId || !newAppointment.date || !selectedTimeSlot || loading}
                        startIcon={loading && <CircularProgress size={20} />}
                    >
                        Confirmar Agendamento
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Modal de confirmação de cancelamento */}
            <Dialog
                open={openCancelDialog}
                onClose={handleCloseCancelDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    Cancelar Consulta
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        Tem certeza que deseja cancelar esta consulta?
                    </Typography>
                    {selectedAppointment && (
                        <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                            <Typography variant="subtitle2">
                                {formatAppointmentType(selectedAppointment.type)}
                            </Typography>
                            <Typography variant="body2">
                                Data: {format(new Date(selectedAppointment.date), 'dd/MM/yyyy')}
                            </Typography>
                            <Typography variant="body2">
                                Horário: {format(new Date(selectedAppointment.date), 'HH:mm')}
                            </Typography>
                            <Typography variant="body2">
                                Profissional: {selectedAppointment.professional?.name}
                            </Typography>
                        </Box>
                    )}
                    <Box sx={{ mt: 2 }}>
                        <Alert severity="warning">
                            O cancelamento de consultas com menos de 24 horas de antecedência pode estar sujeito a taxas conforme política da clínica.
                        </Alert>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseCancelDialog} color="inherit">
                        Voltar
                    </Button>
                    <Button
                        onClick={handleCancelAppointment}
                        variant="contained"
                        color="error"
                        startIcon={<Cancel />}
                        disabled={loading}
                    >
                        Confirmar Cancelamento
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar para mensagens */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={5000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                    variant="filled"
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default PatientAppointments; 