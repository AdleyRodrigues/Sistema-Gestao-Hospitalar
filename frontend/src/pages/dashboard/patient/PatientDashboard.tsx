import { CalendarMonth, History, MedicalServices, VideoCall } from '@mui/icons-material';
import { Box, Button, Card, CardContent, Divider, Grid, Paper, Stack, Tooltip, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { useAuth } from '../../../hooks/useAuth';
import { api } from '../../../services/api';
import ProfileNavHelper from '../../../components/ProfileNavHelper';

// Tipos de dados
interface Appointment {
    id: number;
    doctor: string;
    specialty: string;
    date: string;
    time: string;
}

interface Exam {
    id: number;
    name: string;
    date: string;
    status: string;
}

interface ConsultationData {
    name: string;
    consultations: number;
}

// Interfaces para os dados da API
interface ApiAppointment {
    id: number;
    professionalId: number;
    date: string;
}

interface ApiProfessional {
    id: number;
    name: string;
    specialty: string;
}

interface ApiExam {
    id: number;
    name: string;
    date: string;
    status: string;
}

const PatientDashboard = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [exams, setExams] = useState<Exam[]>([]);
    const [consultationData] = useState<ConsultationData[]>([
        { name: 'Jan', consultations: 2 },
        { name: 'Fev', consultations: 1 },
        { name: 'Mar', consultations: 3 },
        { name: 'Abr', consultations: 2 },
        { name: 'Mai', consultations: 0 },
        { name: 'Jun', consultations: 1 },
    ]);

    // Buscar dados da API
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Buscar consultas
                if (user) {
                    const appointmentsResponse = await api.get(`/appointments?patientId=${user.id}`);
                    const professionalIds = [...new Set(appointmentsResponse.data.map((app: ApiAppointment) => app.professionalId))];

                    // Buscar dados dos profissionais
                    const professionalsResponse = await api.get(`/professionals?${professionalIds.map(id => `id=${id}`).join('&')}`);
                    const professionalsMap = professionalsResponse.data.reduce((acc: Record<number, ApiProfessional>, prof: ApiProfessional) => {
                        acc[prof.id] = prof;
                        return acc;
                    }, {});

                    // Formatar dados das consultas
                    const formattedAppointments = appointmentsResponse.data
                        .filter((app: ApiAppointment) => new Date(app.date) > new Date())
                        .slice(0, 5)
                        .map((app: ApiAppointment) => {
                            const professional = professionalsMap[app.professionalId] || {};
                            const appointmentDate = new Date(app.date);
                            return {
                                id: app.id,
                                doctor: professional.name || 'Profissional não encontrado',
                                specialty: professional.specialty || 'Especialidade não definida',
                                date: appointmentDate.toLocaleDateString('pt-BR'),
                                time: appointmentDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                            };
                        });

                    setAppointments(formattedAppointments);

                    // Buscar exames
                    const examsResponse = await api.get(`/exams?patientId=${user.id}`);
                    const formattedExams = examsResponse.data.map((exam: ApiExam) => ({
                        id: exam.id,
                        name: exam.name,
                        date: new Date(exam.date).toLocaleDateString('pt-BR'),
                        status: exam.status === 'available' ? 'Disponível' : 'Pendente'
                    }));

                    setExams(formattedExams);
                }
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            }
        };

        fetchData();
    }, [user]);

    // Personaliza a saudação com base na hora do dia
    const greeting = useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Bom dia';
        if (hour < 18) return 'Boa tarde';
        return 'Boa noite';
    }, []);

    // Formatando a data atual
    const today = useMemo(() => {
        const date = new Date();
        return date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    }, []);

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    {greeting}, {user?.name}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Bem-vindo ao seu painel de saúde. Confira suas consultas e exames.
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
                    Hoje é {today}
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {/* Cards informativos */}
                <Grid item xs={12}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card sx={{ bgcolor: 'primary.light', color: 'white' }}>
                                <CardContent>
                                    <CalendarMonth />
                                    <Typography variant="h4" sx={{ mt: 1 }}>
                                        {appointments.length}
                                    </Typography>
                                    <Typography variant="body2">
                                        Consultas agendadas
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <Card sx={{ bgcolor: 'secondary.light', color: 'white' }}>
                                <CardContent>
                                    <MedicalServices />
                                    <Typography variant="h4" sx={{ mt: 1 }}>
                                        {exams.length}
                                    </Typography>
                                    <Typography variant="body2">
                                        Exames recentes
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <Card sx={{ bgcolor: 'info.light', color: 'white' }}>
                                <CardContent>
                                    <History />
                                    <Typography variant="h4" sx={{ mt: 1 }}>
                                        5
                                    </Typography>
                                    <Typography variant="body2">
                                        Consultas realizadas
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <Card sx={{ bgcolor: 'success.light', color: 'white' }}>
                                <CardContent>
                                    <VideoCall />
                                    <Typography variant="h4" sx={{ mt: 1 }}>
                                        2
                                    </Typography>
                                    <Typography variant="body2">
                                        Teleconsultas
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>

                {/* Gráfico de consultas */}
                <Grid item xs={12} md={8}>
                    <Paper elevation={2} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Histórico de Consultas
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        <Box sx={{ height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={consultationData}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <ChartTooltip />
                                    <Bar dataKey="consultations" fill="#8884d8" name="Consultas" />
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>
                </Grid>

                {/* Próximas consultas */}
                <Grid item xs={12} md={4}>
                    <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" gutterBottom>
                            Próximas Consultas
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        {appointments.length > 0 ? (
                            <Stack spacing={2}>
                                {appointments.map((appointment) => (
                                    <Paper key={appointment.id} variant="outlined" sx={{ p: 2 }}>
                                        <Typography variant="subtitle1" fontWeight="bold">
                                            {appointment.doctor}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {appointment.specialty}
                                        </Typography>
                                        <Box sx={{ mt: 1 }}>
                                            <Typography variant="body2">
                                                <strong>Data:</strong> {appointment.date}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Hora:</strong> {appointment.time}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ mt: 1 }}>
                                            <Tooltip title="Funcionalidade em desenvolvimento">
                                                <span>
                                                    <Button size="small" variant="contained" sx={{ mr: 1 }} disabled>
                                                        Detalhes
                                                    </Button>
                                                </span>
                                            </Tooltip>
                                            <Tooltip title="Funcionalidade em desenvolvimento">
                                                <span>
                                                    <Button size="small" variant="outlined" disabled>
                                                        Reagendar
                                                    </Button>
                                                </span>
                                            </Tooltip>
                                        </Box>
                                    </Paper>
                                ))}
                            </Stack>
                        ) : (
                            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                                Você não tem consultas agendadas.
                            </Typography>
                        )}
                    </Paper>
                </Grid>

                {/* Exames recentes */}
                <Grid item xs={12}>
                    <Paper elevation={2} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Exames Recentes
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        {exams.length > 0 ? (
                            <Grid container spacing={2}>
                                {exams.map((exam) => (
                                    <Grid item xs={12} sm={6} md={4} key={exam.id}>
                                        <Paper variant="outlined" sx={{ p: 2 }}>
                                            <Typography variant="subtitle1" fontWeight="bold">
                                                {exam.name}
                                            </Typography>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                                <Typography variant="body2">
                                                    <strong>Data:</strong> {exam.date}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    fontWeight="bold"
                                                    color={exam.status === 'Disponível' ? 'success.main' : 'warning.main'}
                                                >
                                                    {exam.status}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ mt: 1 }}>
                                                <Tooltip title="Funcionalidade em desenvolvimento">
                                                    <span>
                                                        <Button size="small" variant="contained" fullWidth disabled>
                                                            Visualizar
                                                        </Button>
                                                    </span>
                                                </Tooltip>
                                            </Box>
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                                Você não tem exames recentes.
                            </Typography>
                        )}
                    </Paper>
                </Grid>
            </Grid>

            {/* Adicionar o helper de navegação para depuração */}
            <ProfileNavHelper />
        </Box>
    );
};

export default PatientDashboard; 