import { useMemo } from 'react';
import { Box, Typography, Grid, Paper, Divider, Button, Stack, Card, CardContent, Tooltip } from '@mui/material';
import { CalendarMonth, Person, Assignment, VideoCall } from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../../hooks/useAuth';

// Dados mockados para o dashboard
const todayAppointments = [
    { id: 1, patient: 'João Silva', time: '10:30', status: 'confirmado', type: 'Consulta' },
    { id: 2, patient: 'Maria Oliveira', time: '11:45', status: 'aguardando', type: 'Retorno' },
    { id: 3, patient: 'Pedro Santos', time: '14:00', status: 'confirmado', type: 'Exame' },
    { id: 4, patient: 'Ana Pereira', time: '15:30', status: 'confirmado', type: 'Consulta' },
];

const patientRecords = [
    { id: 1, patient: 'João Silva', lastVisit: '10/04/2025', condition: 'Hipertensão' },
    { id: 2, patient: 'Maria Oliveira', lastVisit: '05/04/2025', condition: 'Diabetes Tipo 2' },
    { id: 3, patient: 'Pedro Santos', lastVisit: '01/04/2025', condition: 'Artrite' },
];

const attendanceData = [
    { name: 'Jan', pacientes: 45 },
    { name: 'Fev', pacientes: 52 },
    { name: 'Mar', pacientes: 48 },
    { name: 'Abr', pacientes: 58 },
    { name: 'Mai', pacientes: 50 },
    { name: 'Jun', pacientes: 55 },
];

const ProfessionalDashboard = () => {
    const { user } = useAuth();

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
                    Bem-vindo ao seu painel médico. Confira sua agenda e prontuários.
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
                    Hoje é {today}
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {/* Resumo */}
                <Grid item xs={12} md={8}>
                    <Paper elevation={2} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Resumo do Dia
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card sx={{ bgcolor: 'primary.light', color: 'white' }}>
                                    <CardContent>
                                        <CalendarMonth />
                                        <Typography variant="h4" sx={{ mt: 1 }}>
                                            {todayAppointments.length}
                                        </Typography>
                                        <Typography variant="body2">
                                            Consultas hoje
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <Card sx={{ bgcolor: 'secondary.light', color: 'white' }}>
                                    <CardContent>
                                        <Person />
                                        <Typography variant="h4" sx={{ mt: 1 }}>
                                            42
                                        </Typography>
                                        <Typography variant="body2">
                                            Pacientes ativos
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <Card sx={{ bgcolor: 'info.light', color: 'white' }}>
                                    <CardContent>
                                        <Assignment />
                                        <Typography variant="h4" sx={{ mt: 1 }}>
                                            15
                                        </Typography>
                                        <Typography variant="body2">
                                            Prontuários atualizados
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <Card sx={{ bgcolor: 'success.light', color: 'white' }}>
                                    <CardContent>
                                        <VideoCall />
                                        <Typography variant="h4" sx={{ mt: 1 }}>
                                            5
                                        </Typography>
                                        <Typography variant="body2">
                                            Teleconsultas
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>

                        {/* Gráfico de Atendimentos */}
                        <Box sx={{ mt: 4, height: 300 }}>
                            <Typography variant="h6" gutterBottom>
                                Histórico de Atendimentos
                            </Typography>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={attendanceData}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="pacientes" stroke="#00C853" activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>
                </Grid>

                {/* Agenda do Dia */}
                <Grid item xs={12} md={4}>
                    <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6">
                                Agenda de Hoje
                            </Typography>
                            <Button variant="outlined" size="small">
                                Ver Completa
                            </Button>
                        </Box>
                        <Divider sx={{ mb: 2 }} />

                        {todayAppointments.length > 0 ? (
                            <Stack spacing={2}>
                                {todayAppointments.map((appointment) => (
                                    <Paper key={appointment.id} variant="outlined" sx={{ p: 2 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="subtitle1" fontWeight="bold">
                                                {appointment.patient}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                fontWeight="bold"
                                                color={appointment.status === 'confirmado' ? 'success.main' : 'warning.main'}
                                            >
                                                {appointment.status}
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2" color="text.secondary">
                                            {appointment.type}
                                        </Typography>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                            <Typography variant="body2" fontWeight="bold">
                                                {appointment.time}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ mt: 1 }}>
                                            <Tooltip title="Funcionalidade em desenvolvimento">
                                                <span>
                                                    <Button size="small" variant="contained" sx={{ mr: 1 }} disabled>
                                                        Atender
                                                    </Button>
                                                </span>
                                            </Tooltip>
                                            <Tooltip title="Funcionalidade em desenvolvimento">
                                                <span>
                                                    <Button size="small" variant="outlined" disabled>
                                                        Prontuário
                                                    </Button>
                                                </span>
                                            </Tooltip>
                                        </Box>
                                    </Paper>
                                ))}
                            </Stack>
                        ) : (
                            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                                Você não tem consultas hoje.
                            </Typography>
                        )}

                        <Box sx={{ mt: 4 }}>
                            <Typography variant="h6" gutterBottom>
                                Prontuários Recentes
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            {patientRecords.length > 0 ? (
                                <Stack spacing={2}>
                                    {patientRecords.map((record) => (
                                        <Paper key={record.id} variant="outlined" sx={{ p: 2 }}>
                                            <Typography variant="subtitle1" fontWeight="bold">
                                                {record.patient}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {record.condition}
                                            </Typography>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Última consulta: {record.lastVisit}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ mt: 1 }}>
                                                <Tooltip title="Funcionalidade em desenvolvimento">
                                                    <span>
                                                        <Button size="small" variant="outlined" disabled>
                                                            Ver Prontuário
                                                        </Button>
                                                    </span>
                                                </Tooltip>
                                            </Box>
                                        </Paper>
                                    ))}
                                </Stack>
                            ) : (
                                <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                                    Nenhum prontuário recente.
                                </Typography>
                            )}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ProfessionalDashboard; 