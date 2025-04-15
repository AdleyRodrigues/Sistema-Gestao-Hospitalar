import { useMemo } from 'react';
import { Box, Typography, Grid, Paper, Divider, Button, Stack, Card, CardContent, Tooltip } from '@mui/material';
import { People, LocalHospital, MedicalServices, Analytics } from '@mui/icons-material';
import { PieChart, Pie, Cell, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip as ChartTooltip } from 'recharts';
import { useAuth } from '../../../hooks/useAuth';

// Dados mockados para o dashboard
const occupancyData = [
    { name: 'Ocupado', value: 75 },
    { name: 'Disponível', value: 25 },
];

const departmentData = [
    { name: 'Cardiologia', pacientes: 32 },
    { name: 'Ortopedia', pacientes: 28 },
    { name: 'Neurologia', pacientes: 15 },
    { name: 'Pediatria', pacientes: 22 },
    { name: 'Clínica Geral', pacientes: 45 },
];

const revenueData = [
    { name: 'Jan', receita: 120000 },
    { name: 'Fev', receita: 135000 },
    { name: 'Mar', receita: 128000 },
    { name: 'Abr', receita: 145000 },
    { name: 'Mai', receita: 160000 },
    { name: 'Jun', receita: 155000 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const alerts = [
    { id: 1, title: 'Baixo estoque de medicamentos', priority: 'alta', date: '15/04/2025' },
    { id: 2, title: 'Manutenção de equipamentos pendente', priority: 'média', date: '18/04/2025' },
    { id: 3, title: 'Revisão de procedimentos necessária', priority: 'baixa', date: '22/04/2025' },
];

const AdminDashboard = () => {
    const { user } = useAuth();

    // Personaliza a saudação com base na hora do dia
    const greeting = useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Bom dia';
        if (hour < 18) return 'Boa tarde';
        return 'Boa noite';
    }, []);

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    {greeting}, {user?.name}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Bem-vindo ao painel administrativo. Confira os indicadores de desempenho.
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {/* Indicadores principais */}
                <Grid item xs={12} lg={9}>
                    <Grid container spacing={3}>
                        {/* Cards de resumo */}
                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Card sx={{ bgcolor: 'primary.light', color: 'white' }}>
                                        <CardContent>
                                            <People />
                                            <Typography variant="h4" sx={{ mt: 1 }}>
                                                254
                                            </Typography>
                                            <Typography variant="body2">
                                                Pacientes ativos
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid item xs={12} sm={6} md={3}>
                                    <Card sx={{ bgcolor: 'secondary.light', color: 'white' }}>
                                        <CardContent>
                                            <MedicalServices />
                                            <Typography variant="h4" sx={{ mt: 1 }}>
                                                38
                                            </Typography>
                                            <Typography variant="body2">
                                                Profissionais
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid item xs={12} sm={6} md={3}>
                                    <Card sx={{ bgcolor: 'info.light', color: 'white' }}>
                                        <CardContent>
                                            <LocalHospital />
                                            <Typography variant="h4" sx={{ mt: 1 }}>
                                                75%
                                            </Typography>
                                            <Typography variant="body2">
                                                Taxa de ocupação
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid item xs={12} sm={6} md={3}>
                                    <Card sx={{ bgcolor: 'success.light', color: 'white' }}>
                                        <CardContent>
                                            <Analytics />
                                            <Typography variant="h4" sx={{ mt: 1 }}>
                                                R$ 160K
                                            </Typography>
                                            <Typography variant="body2">
                                                Receita mensal
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Grid>

                        {/* Gráfico de receita */}
                        <Grid item xs={12} md={8}>
                            <Paper elevation={2} sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    Receita Mensal
                                </Typography>
                                <Divider sx={{ mb: 2 }} />

                                <Box sx={{ height: 300 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart
                                            data={revenueData}
                                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <ChartTooltip formatter={(value) => `R$ ${value.toLocaleString()}`} />
                                            <Legend />
                                            <Line type="monotone" dataKey="receita" stroke="#8884d8" activeDot={{ r: 8 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </Box>
                            </Paper>
                        </Grid>

                        {/* Gráfico de ocupação */}
                        <Grid item xs={12} md={4}>
                            <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                                <Typography variant="h6" gutterBottom>
                                    Taxa de Ocupação
                                </Typography>
                                <Divider sx={{ mb: 2 }} />

                                <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={occupancyData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {occupancyData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <ChartTooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </Box>
                            </Paper>
                        </Grid>

                        {/* Gráfico de pacientes por departamento */}
                        <Grid item xs={12}>
                            <Paper elevation={2} sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    Pacientes por Departamento
                                </Typography>
                                <Divider sx={{ mb: 2 }} />

                                <Box sx={{ height: 300 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={departmentData}
                                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <ChartTooltip />
                                            <Legend />
                                            <Bar dataKey="pacientes" fill="#1976D2" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>

                {/* Alertas e notificações */}
                <Grid item xs={12} lg={3}>
                    <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6">
                                Alertas e Notificações
                            </Typography>
                            <Tooltip title="Funcionalidade em desenvolvimento">
                                <span>
                                    <Button variant="outlined" size="small" disabled>
                                        Ver Todos
                                    </Button>
                                </span>
                            </Tooltip>
                        </Box>
                        <Divider sx={{ mb: 2 }} />

                        {alerts.length > 0 ? (
                            <Stack spacing={2}>
                                {alerts.map((alert) => (
                                    <Paper
                                        key={alert.id}
                                        variant="outlined"
                                        sx={{
                                            p: 2,
                                            borderLeft: '4px solid',
                                            borderLeftColor:
                                                alert.priority === 'alta'
                                                    ? 'error.main'
                                                    : alert.priority === 'média'
                                                        ? 'warning.main'
                                                        : 'info.main'
                                        }}
                                    >
                                        <Typography variant="subtitle1" fontWeight="bold">
                                            {alert.title}
                                        </Typography>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    textTransform: 'uppercase',
                                                    fontWeight: 'bold',
                                                    color:
                                                        alert.priority === 'alta'
                                                            ? 'error.main'
                                                            : alert.priority === 'média'
                                                                ? 'warning.main'
                                                                : 'info.main'
                                                }}
                                            >
                                                Prioridade {alert.priority}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {alert.date}
                                            </Typography>
                                        </Box>
                                        <Tooltip title="Funcionalidade em desenvolvimento">
                                            <span>
                                                <Button size="small" variant="outlined" disabled>
                                                    Detalhes
                                                </Button>
                                            </span>
                                        </Tooltip>
                                    </Paper>
                                ))}
                            </Stack>
                        ) : (
                            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                                Nenhum alerta pendente.
                            </Typography>
                        )}

                        <Box sx={{ mt: 4 }}>
                            <Typography variant="h6" gutterBottom>
                                Ações Rápidas
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            <Stack spacing={2}>
                                <Tooltip title="Funcionalidade em desenvolvimento">
                                    <span>
                                        <Button variant="contained" fullWidth disabled>
                                            Gerar Relatório Completo
                                        </Button>
                                    </span>
                                </Tooltip>
                                <Tooltip title="Funcionalidade em desenvolvimento">
                                    <span>
                                        <Button variant="outlined" fullWidth disabled>
                                            Gerenciar Usuários
                                        </Button>
                                    </span>
                                </Tooltip>
                                <Tooltip title="Funcionalidade em desenvolvimento">
                                    <span>
                                        <Button variant="outlined" fullWidth disabled>
                                            Configurações do Sistema
                                        </Button>
                                    </span>
                                </Tooltip>
                            </Stack>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AdminDashboard; 