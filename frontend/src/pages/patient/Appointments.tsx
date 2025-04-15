import React from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, Divider, Button } from '@mui/material';
import { CalendarMonth, AccessTime } from '@mui/icons-material';

const PatientAppointments = () => {
    // Dados mockados de consultas
    const appointments = [
        { id: 1, doctor: 'Dr. Carlos Silva', specialty: 'Cardiologia', date: '25/04/2025', time: '14:30' },
        { id: 2, doctor: 'Dra. Ana Oliveira', specialty: 'Endocrinologia', date: '27/04/2025', time: '10:15' },
        { id: 3, doctor: 'Dr. Roberto Santos', specialty: 'Oftalmologia', date: '30/04/2025', time: '15:45' },
    ];

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Minhas Consultas
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Gerencie suas consultas agendadas e histórico de atendimentos.
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper elevation={2} sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6">
                                Próximas Consultas
                            </Typography>
                            <Button variant="contained" startIcon={<CalendarMonth />}>
                                Agendar Nova Consulta
                            </Button>
                        </Box>
                        <Divider sx={{ mb: 3 }} />

                        <Grid container spacing={2}>
                            {appointments.map((appointment) => (
                                <Grid item xs={12} md={4} key={appointment.id}>
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                {appointment.doctor}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                {appointment.specialty}
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                                                <CalendarMonth fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                                                <Typography variant="body2">
                                                    {appointment.date}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                <AccessTime fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                                                <Typography variant="body2">
                                                    {appointment.time}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                                                <Button size="small" variant="contained" fullWidth>
                                                    Detalhes
                                                </Button>
                                                <Button size="small" variant="outlined" fullWidth color="error">
                                                    Cancelar
                                                </Button>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>
                </Grid>

                <Grid item xs={12}>
                    <Paper elevation={2} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Histórico de Consultas
                        </Typography>
                        <Divider sx={{ mb: 3 }} />
                        <Typography variant="body1" color="text.secondary" align="center">
                            Você ainda não possui histórico de consultas anteriores.
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default PatientAppointments; 