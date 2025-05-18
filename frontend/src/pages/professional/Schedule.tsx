import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Tab,
    Tabs,
    TextField,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import {
    ArrowBack,
    ArrowForward,
    CalendarMonth,
    CheckCircle,
    Close,
    Delete,
    Edit,
    Event,
    EventAvailable,
    EventBusy,
    Person,
    VideoCall,
    Visibility
} from '@mui/icons-material';
import { api } from '../../services/api';
import { format, addDays, startOfWeek, endOfWeek, addWeeks, subWeeks, isToday, isSameDay, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Interface para as consultas
interface Appointment {
    id: string;
    patientId: string;
    professionalId: string;
    date: string;
    status: 'scheduled' | 'completed' | 'canceled';
    type: 'consultation' | 'return' | 'telemedicine';
    notes: string;
    patientName?: string;
}

// Interface para pacientes
interface Patient {
    id: string;
    name: string;
    email: string;
    phone?: string;
    birthDate?: string;
    gender?: string;
}

const ProfessionalSchedule = () => {
    const { user } = useAuth();
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
    const isExtraSmall = useMediaQuery('(max-width:400px)');

    // Estados para controle da visualização
    const [tabValue, setTabValue] = useState(0);  // 0: Diário, 1: Semanal, 2: Mensal
    const [currentDate, setCurrentDate] = useState(new Date());
    const [weekStart, setWeekStart] = useState(startOfWeek(currentDate, { weekStartsOn: 1 }));
    const [weekEnd, setWeekEnd] = useState(endOfWeek(currentDate, { weekStartsOn: 1 }));

    // Estados para os dados
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Estados para diálogos
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openCancelDialog, setOpenCancelDialog] = useState(false);

    // Estado para edição de consulta
    const [appointmentForm, setAppointmentForm] = useState({
        date: '',
        status: '',
        notes: ''
    });

    // Carregar dados necessários
    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;

            setLoading(true);
            setError(null);

            try {
                // Buscar consultas do profissional
                const appointmentsResponse = await api.get(`/appointments?professionalId=${user.id}`);

                // Buscar dados de pacientes para exibir seus nomes
                const patientsResponse = await api.get('/patients');

                if (appointmentsResponse.data && Array.isArray(appointmentsResponse.data)) {
                    // Enriquecer dados das consultas com nomes de pacientes
                    const patientMap = new Map();
                    if (patientsResponse.data && Array.isArray(patientsResponse.data)) {
                        patientsResponse.data.forEach((patient: Patient) => {
                            patientMap.set(patient.id, patient);
                        });
                        setPatients(patientsResponse.data);
                    }

                    // Adicionar nome do paciente a cada consulta
                    const enrichedAppointments = appointmentsResponse.data.map((appointment: Appointment) => {
                        const patient = patientMap.get(appointment.patientId);
                        return {
                            ...appointment,
                            patientName: patient ? patient.name : 'Paciente não encontrado'
                        };
                    });

                    setAppointments(enrichedAppointments);
                }
            } catch (err) {
                console.error('Erro ao buscar dados da agenda:', err);
                setError('Erro ao carregar agenda. Por favor, tente novamente mais tarde.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    // Atualizar datas da semana ao mudar a data atual
    useEffect(() => {
        setWeekStart(startOfWeek(currentDate, { weekStartsOn: 1 }));
        setWeekEnd(endOfWeek(currentDate, { weekStartsOn: 1 }));
    }, [currentDate]);

    // Manipuladores de eventos
    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleNextPeriod = () => {
        if (tabValue === 0) {
            // Próximo dia
            setCurrentDate(prev => addDays(prev, 1));
        } else if (tabValue === 1) {
            // Próxima semana
            setCurrentDate(prev => addWeeks(prev, 1));
        }
        // Para o modo mensal, seria implementado o próximo mês
    };

    const handlePreviousPeriod = () => {
        if (tabValue === 0) {
            // Dia anterior
            setCurrentDate(prev => addDays(prev, -1));
        } else if (tabValue === 1) {
            // Semana anterior
            setCurrentDate(prev => subWeeks(prev, 1));
        }
        // Para o modo mensal, seria implementado o mês anterior
    };

    const handleToday = () => {
        setCurrentDate(new Date());
    };

    const handleOpenDetails = (appointment: Appointment) => {
        setSelectedAppointment(appointment);
        setOpenDetailsDialog(true);
    };

    const handleOpenEdit = (appointment: Appointment) => {
        setSelectedAppointment(appointment);
        setAppointmentForm({
            date: appointment.date,
            status: appointment.status,
            notes: appointment.notes
        });
        setOpenEditDialog(true);
    };

    const handleOpenCancel = (appointment: Appointment) => {
        setSelectedAppointment(appointment);
        setOpenCancelDialog(true);
    };

    const handleCloseDetails = () => {
        setOpenDetailsDialog(false);
    };

    const handleCloseEdit = () => {
        setOpenEditDialog(false);
    };

    const handleCloseCancel = () => {
        setOpenCancelDialog(false);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const { name, value } = e.target;
        if (name) {
            setAppointmentForm(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleUpdateAppointment = async () => {
        if (!selectedAppointment) return;

        try {
            // Atualizar a consulta
            const updatedAppointment = {
                ...selectedAppointment,
                date: appointmentForm.date,
                status: appointmentForm.status,
                notes: appointmentForm.notes
            };

            await api.put(`/appointments/${selectedAppointment.id}`, updatedAppointment);

            // Atualizar estado local
            setAppointments(prev =>
                prev.map(app =>
                    app.id === selectedAppointment.id ? updatedAppointment : app
                )
            );

            handleCloseEdit();
            alert('Consulta atualizada com sucesso!');
        } catch (error) {
            console.error('Erro ao atualizar consulta:', error);
            alert('Erro ao atualizar consulta. Por favor, tente novamente.');
        }
    };

    const handleCancelAppointment = async () => {
        if (!selectedAppointment) return;

        try {
            // Atualizar status da consulta para cancelada
            const canceledAppointment = {
                ...selectedAppointment,
                status: 'canceled'
            };

            await api.put(`/appointments/${selectedAppointment.id}`, canceledAppointment);

            // Atualizar estado local
            setAppointments(prev =>
                prev.map(app =>
                    app.id === selectedAppointment.id ? canceledAppointment : app
                )
            );

            handleCloseCancel();
            alert('Consulta cancelada com sucesso!');
        } catch (error) {
            console.error('Erro ao cancelar consulta:', error);
            alert('Erro ao cancelar consulta. Por favor, tente novamente.');
        }
    };

    // Auxiliares para renderização de status e tipo
    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'scheduled': return 'Agendada';
            case 'completed': return 'Realizada';
            case 'canceled': return 'Cancelada';
            default: return status;
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'consultation': return 'Consulta';
            case 'return': return 'Retorno';
            case 'telemedicine': return 'Telemedicina';
            default: return type;
        }
    };

    // Filtrar consultas para o dia atual 
    const getAppointmentsForDay = (date: Date) => {
        return appointments.filter(appointment => {
            const appointmentDate = parseISO(appointment.date);
            return isSameDay(appointmentDate, date);
        }).sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateA.getTime() - dateB.getTime();
        });
    };

    // Renderizações condicionais com base no modo de visualização
    const renderDayView = () => {
        const today = currentDate;
        const todayAppointments = getAppointmentsForDay(today);

        return (
            <Card elevation={2}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        {format(currentDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        {isToday(currentDate) && (
                            <Chip
                                label="Hoje"
                                color="primary"
                                size="small"
                                sx={{ ml: 2, fontWeight: 'bold' }}
                            />
                        )}
                    </Typography>

                    <Divider sx={{ mb: 2 }} />

                    {todayAppointments.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <EventBusy sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.5 }} />
                            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                                Nenhuma consulta agendada para este dia
                            </Typography>
                        </Box>
                    ) : (
                        <Grid container spacing={2}>
                            {todayAppointments.map((appointment) => (
                                <Grid item xs={12} key={appointment.id}>
                                    <Paper
                                        elevation={1}
                                        sx={{
                                            p: 2,
                                            borderLeft: '4px solid',
                                            borderColor: appointment.status === 'canceled'
                                                ? 'error.main'
                                                : appointment.status === 'completed'
                                                    ? 'success.main'
                                                    : appointment.type === 'telemedicine'
                                                        ? 'info.main'
                                                        : 'primary.main',
                                            opacity: appointment.status === 'canceled' ? 0.7 : 1
                                        }}
                                    >
                                        <Grid container spacing={2} alignItems="center">
                                            <Grid item xs={12} sm={3}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Horário
                                                </Typography>
                                                <Typography variant="body1" fontWeight="bold">
                                                    {format(new Date(appointment.date), 'HH:mm')}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Paciente
                                                </Typography>
                                                <Typography variant="body1">
                                                    {appointment.patientName}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6} sm={2}>
                                                <Chip
                                                    label={getTypeLabel(appointment.type)}
                                                    size="small"
                                                    color={appointment.type === 'telemedicine' ? 'info' : 'primary'}
                                                    icon={appointment.type === 'telemedicine' ? <VideoCall /> : <Event />}
                                                />
                                            </Grid>
                                            <Grid item xs={6} sm={3} sx={{ textAlign: 'right' }}>
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => handleOpenDetails(appointment)}
                                                    size={isExtraSmall ? "small" : "medium"}
                                                >
                                                    <Visibility />
                                                </IconButton>

                                                {appointment.status === 'scheduled' && (
                                                    <>
                                                        <IconButton
                                                            color="secondary"
                                                            onClick={() => handleOpenEdit(appointment)}
                                                            size={isExtraSmall ? "small" : "medium"}
                                                        >
                                                            <Edit />
                                                        </IconButton>
                                                        <IconButton
                                                            color="error"
                                                            onClick={() => handleOpenCancel(appointment)}
                                                            size={isExtraSmall ? "small" : "medium"}
                                                        >
                                                            <Delete />
                                                        </IconButton>
                                                    </>
                                                )}
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </CardContent>
            </Card>
        );
    };

    return (
        <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
            <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, mb: 3, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap' }}>
                    <Typography variant={isSmall ? 'h5' : 'h4'} component="h1" sx={{ fontWeight: 'bold', mb: { xs: 1, sm: 0 } }}>
                        Minha Agenda
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            variant="outlined"
                            onClick={handleToday}
                            size={isSmall ? "small" : "medium"}
                        >
                            Hoje
                        </Button>
                    </Box>
                </Box>

                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        variant="scrollable"
                        scrollButtons="auto"
                    >
                        <Tab label="Diário" icon={<Event />} iconPosition="start" />
                        <Tab label="Semanal" icon={<CalendarMonth />} iconPosition="start" />
                        {/* <Tab label="Mensal" icon={<DateRange />} iconPosition="start" /> */}
                    </Tabs>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <IconButton onClick={handlePreviousPeriod}>
                        <ArrowBack />
                    </IconButton>

                    <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                        {tabValue === 0
                            ? format(currentDate, "d 'de' MMMM", { locale: ptBR })
                            : `${format(weekStart, "d 'de' MMMM", { locale: ptBR })} - ${format(weekEnd, "d 'de' MMMM", { locale: ptBR })}`
                        }
                    </Typography>

                    <IconButton onClick={handleNextPeriod}>
                        <ArrowForward />
                    </IconButton>
                </Box>
            </Paper>

            {/* Conteúdo da agenda baseado na visualização selecionada */}
            {tabValue === 0 && renderDayView()}

            {tabValue === 1 && (
                <Box sx={{ mb: 2 }}>
                    <Typography color="textSecondary" align="center" sx={{ mb: 2 }}>
                        Visualização semanal em implementação...
                    </Typography>
                    <Grid container spacing={2}>
                        {Array.from({ length: 7 }).map((_, index) => {
                            const day = addDays(weekStart, index);
                            return (
                                <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={index}>
                                    <Paper
                                        elevation={1}
                                        sx={{
                                            p: 2,
                                            bgcolor: isToday(day) ? 'primary.light' : 'background.paper',
                                            color: isToday(day) ? 'primary.contrastText' : 'text.primary',
                                        }}
                                    >
                                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                            {format(day, 'EEE, d', { locale: ptBR })}
                                        </Typography>
                                        <Divider sx={{ mb: 1 }} />

                                        {getAppointmentsForDay(day).length > 0 ? (
                                            <>
                                                {getAppointmentsForDay(day).slice(0, 3).map((app) => (
                                                    <Box
                                                        key={app.id}
                                                        sx={{
                                                            p: 1,
                                                            mb: 1,
                                                            bgcolor: isToday(day) ? 'rgba(255,255,255,0.1)' : 'background.default',
                                                            borderRadius: 1,
                                                            cursor: 'pointer'
                                                        }}
                                                        onClick={() => handleOpenDetails(app)}
                                                    >
                                                        <Typography variant="body2" noWrap>
                                                            {format(new Date(app.date), 'HH:mm')} - {app.patientName}
                                                        </Typography>
                                                    </Box>
                                                ))}

                                                {getAppointmentsForDay(day).length > 3 && (
                                                    <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                                                        + {getAppointmentsForDay(day).length - 3} mais
                                                    </Typography>
                                                )}
                                            </>
                                        ) : (
                                            <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
                                                Sem consultas
                                            </Typography>
                                        )}
                                    </Paper>
                                </Grid>
                            );
                        })}
                    </Grid>
                </Box>
            )}

            {/* Dialog de Detalhes da Consulta */}
            <Dialog open={openDetailsDialog} onClose={handleCloseDetails} maxWidth="sm" fullWidth>
                <DialogTitle>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        Detalhes da Consulta
                        <IconButton onClick={handleCloseDetails} size="small">
                            <Close />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent dividers>
                    {selectedAppointment && (
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" color="text.secondary">Paciente</Typography>
                                <Typography variant="body1" gutterBottom>{selectedAppointment.patientName}</Typography>

                                <Typography variant="subtitle2" color="text.secondary">Data e Hora</Typography>
                                <Typography variant="body1" gutterBottom>
                                    {format(new Date(selectedAppointment.date), "dd/MM/yyyy 'às' HH:mm")}
                                </Typography>

                                <Typography variant="subtitle2" color="text.secondary">Tipo</Typography>
                                <Chip
                                    label={getTypeLabel(selectedAppointment.type)}
                                    size="small"
                                    color={selectedAppointment.type === 'telemedicine' ? 'info' : 'primary'}
                                    sx={{ mt: 0.5 }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                                <Chip
                                    label={getStatusLabel(selectedAppointment.status)}
                                    size="small"
                                    color={
                                        selectedAppointment.status === 'canceled'
                                            ? 'error'
                                            : selectedAppointment.status === 'completed'
                                                ? 'success'
                                                : 'primary'
                                    }
                                    icon={
                                        selectedAppointment.status === 'canceled'
                                            ? <Delete />
                                            : selectedAppointment.status === 'completed'
                                                ? <CheckCircle />
                                                : <EventAvailable />
                                    }
                                    sx={{ mt: 0.5 }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="subtitle2" color="text.secondary">Observações</Typography>
                                <Paper variant="outlined" sx={{ p: 1.5, mt: 0.5, bgcolor: 'background.default' }}>
                                    <Typography variant="body2">
                                        {selectedAppointment.notes || 'Sem observações registradas.'}
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDetails} variant="outlined">Fechar</Button>
                    {selectedAppointment && selectedAppointment.status === 'scheduled' && (
                        <>
                            <Button
                                onClick={() => {
                                    handleCloseDetails();
                                    handleOpenEdit(selectedAppointment);
                                }}
                                color="primary"
                                variant="outlined"
                            >
                                Editar
                            </Button>
                            <Button
                                onClick={() => {
                                    handleCloseDetails();
                                    handleOpenCancel(selectedAppointment);
                                }}
                                color="error"
                                variant="contained"
                            >
                                Cancelar Consulta
                            </Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>

            {/* Dialog de Edição da Consulta */}
            <Dialog open={openEditDialog} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
                <DialogTitle>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        Editar Consulta
                        <IconButton onClick={handleCloseEdit} size="small">
                            <Close />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent dividers>
                    {selectedAppointment && (
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Consulta de {selectedAppointment.patientName}
                                </Typography>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Data e Hora"
                                    type="datetime-local"
                                    name="date"
                                    value={appointmentForm.date ? appointmentForm.date.slice(0, 16) : ''}
                                    onChange={handleFormChange}
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                        name="status"
                                        value={appointmentForm.status}
                                        label="Status"
                                        onChange={handleFormChange}
                                    >
                                        <MenuItem value="scheduled">Agendada</MenuItem>
                                        <MenuItem value="completed">Realizada</MenuItem>
                                        <MenuItem value="canceled">Cancelada</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    label="Observações"
                                    name="notes"
                                    value={appointmentForm.notes}
                                    onChange={handleFormChange}
                                    fullWidth
                                    multiline
                                    rows={4}
                                />
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEdit} variant="outlined">Cancelar</Button>
                    <Button onClick={handleUpdateAppointment} variant="contained" color="primary">
                        Salvar Alterações
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog de Cancelamento da Consulta */}
            <Dialog open={openCancelDialog} onClose={handleCloseCancel} maxWidth="xs" fullWidth>
                <DialogTitle>
                    Cancelar Consulta
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" gutterBottom>
                        Tem certeza que deseja cancelar esta consulta?
                    </Typography>
                    {selectedAppointment && (
                        <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                            <Typography variant="body2">
                                <strong>Paciente:</strong> {selectedAppointment.patientName}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Data/Hora:</strong> {format(new Date(selectedAppointment.date), "dd/MM/yyyy 'às' HH:mm")}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Tipo:</strong> {getTypeLabel(selectedAppointment.type)}
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseCancel} variant="outlined">
                        Não, Manter
                    </Button>
                    <Button onClick={handleCancelAppointment} variant="contained" color="error">
                        Sim, Cancelar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ProfessionalSchedule; 