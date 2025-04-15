import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Button,
    Card,
    CardContent,
    Divider,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    Tab
} from '@mui/material';
import {
    CalendarMonth,
    Today,
    Event,
    AccessTime,
    Person,
    Add
} from '@mui/icons-material';

const Schedule = () => {
    const [selectedTab, setSelectedTab] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue);
    };

    // Dados mockados de consultas
    const todayAppointments = [
        { id: 1, time: '08:30', patient: 'João Silva', type: 'Consulta', status: 'Confirmado' },
        { id: 2, time: '09:15', patient: 'Maria Oliveira', type: 'Retorno', status: 'Confirmado' },
        { id: 3, time: '10:00', patient: 'Pedro Santos', type: 'Telemedicina', status: 'Pendente' },
        { id: 4, time: '11:30', patient: 'Ana Pereira', type: 'Consulta', status: 'Confirmado' },
        { id: 5, time: '14:00', patient: 'Carlos Ferreira', type: 'Exame', status: 'Confirmado' },
        { id: 6, time: '15:30', patient: 'Lucia Mendes', type: 'Consulta', status: 'Cancelado' },
    ];

    const weekAppointments = [
        { id: 1, date: '22/04/2025', time: '08:30', patient: 'João Silva', type: 'Consulta' },
        { id: 2, date: '22/04/2025', time: '14:00', patient: 'Maria Oliveira', type: 'Retorno' },
        { id: 3, date: '23/04/2025', time: '09:00', patient: 'Pedro Santos', type: 'Telemedicina' },
        { id: 4, date: '23/04/2025', time: '16:30', patient: 'Ana Pereira', type: 'Consulta' },
        { id: 5, date: '24/04/2025', time: '10:00', patient: 'Carlos Ferreira', type: 'Exame' },
        { id: 6, date: '25/04/2025', time: '14:30', patient: 'Lucia Mendes', type: 'Consulta' },
    ];

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">
                    Agenda
                </Typography>
                <Button variant="contained" startIcon={<Add />}>
                    Nova Consulta
                </Button>
            </Box>

            <Paper elevation={2} sx={{ p: 0, mb: 3 }}>
                <Tabs
                    value={selectedTab}
                    onChange={handleTabChange}
                    variant="fullWidth"
                >
                    <Tab icon={<Today />} label="HOJE" />
                    <Tab icon={<CalendarMonth />} label="SEMANA" />
                    <Tab icon={<Event />} label="MÊS" />
                </Tabs>

                <Box sx={{ p: 3 }}>
                    {selectedTab === 0 && (
                        <>
                            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                                <Today sx={{ mr: 1, color: 'primary.main' }} />
                                <Typography variant="h6">
                                    Consultas de Hoje
                                </Typography>
                            </Box>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Horário</TableCell>
                                            <TableCell>Paciente</TableCell>
                                            <TableCell>Tipo</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell align="right">Ações</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {todayAppointments.map((appointment) => (
                                            <TableRow key={appointment.id}>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <AccessTime fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                                        {appointment.time}
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Person fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                                        {appointment.patient}
                                                    </Box>
                                                </TableCell>
                                                <TableCell>{appointment.type}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        size="small"
                                                        label={appointment.status}
                                                        color={
                                                            appointment.status === 'Confirmado'
                                                                ? 'success'
                                                                : appointment.status === 'Pendente'
                                                                    ? 'warning'
                                                                    : 'error'
                                                        }
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Button size="small" variant="contained" sx={{ mr: 1 }}>
                                                        Atender
                                                    </Button>
                                                    <Button size="small" variant="outlined">
                                                        Editar
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </>
                    )}

                    {selectedTab === 1 && (
                        <>
                            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                                <CalendarMonth sx={{ mr: 1, color: 'primary.main' }} />
                                <Typography variant="h6">
                                    Consultas da Semana
                                </Typography>
                            </Box>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Data</TableCell>
                                            <TableCell>Horário</TableCell>
                                            <TableCell>Paciente</TableCell>
                                            <TableCell>Tipo</TableCell>
                                            <TableCell align="right">Ações</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {weekAppointments.map((appointment) => (
                                            <TableRow key={appointment.id}>
                                                <TableCell>{appointment.date}</TableCell>
                                                <TableCell>{appointment.time}</TableCell>
                                                <TableCell>{appointment.patient}</TableCell>
                                                <TableCell>{appointment.type}</TableCell>
                                                <TableCell align="right">
                                                    <Button size="small" variant="outlined" sx={{ mr: 1 }}>
                                                        Detalhes
                                                    </Button>
                                                    <Button size="small" variant="outlined" color="error">
                                                        Cancelar
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </>
                    )}

                    {selectedTab === 2 && (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <Typography variant="h6" color="text.secondary">
                                Visualização mensal em desenvolvimento
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                                Em breve você poderá visualizar e gerenciar sua agenda mensal completa.
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Paper>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={2} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Estatísticas
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Card sx={{ bgcolor: 'primary.light', color: 'white' }}>
                                    <CardContent>
                                        <Typography variant="h4">
                                            32
                                        </Typography>
                                        <Typography variant="body2">
                                            Consultas esta semana
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={6}>
                                <Card sx={{ bgcolor: 'secondary.light', color: 'white' }}>
                                    <CardContent>
                                        <Typography variant="h4">
                                            6
                                        </Typography>
                                        <Typography variant="body2">
                                            Consultas hoje
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper elevation={2} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Ações Rápidas
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Button variant="contained" startIcon={<Add />}>
                                Adicionar Horário Disponível
                            </Button>
                            <Button variant="outlined" startIcon={<Event />}>
                                Bloquear Período na Agenda
                            </Button>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Schedule; 