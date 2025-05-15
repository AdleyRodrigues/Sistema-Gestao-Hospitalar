import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    Paper,
    Card,
    CardContent,
    CardHeader,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    IconButton,
    CircularProgress,
    Avatar,
    Menu,
    Tooltip,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    ListItemSecondaryAction,
    Chip
} from '@mui/material';
import {
    People,
    PersonAdd,
    MedicalServices,
    TrendingUp,
    TrendingDown,
    AttachMoney,
    AccountBalance,
    Event,
    MoreVert,
    InsertDriveFile,
    Print,
    FileDownload,
    CloudDownload,
    Refresh,
    Person,
    LocationOn,
    CalendarMonth,
    Schedule,
    Phone,
    Assessment
} from '@mui/icons-material';
import { format, addDays, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as ChartTooltip,
    Legend,
    ResponsiveContainer,
    Cell
} from 'recharts';
import { useAuth } from '../../../hooks/useAuth';
import { api } from '../../../services/api';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [period, setPeriod] = useState('month');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [stats, setStats] = useState({
        totalPatients: 0,
        newPatients: 0,
        totalProfessionals: 0,
        totalAppointments: 0,
        completedAppointments: 0,
        cancelledAppointments: 0,
        revenue: 0,
        expenses: 0,
        profit: 0
    });
    const [appointmentsByType, setAppointmentsByType] = useState<any[]>([]);
    const [revenueData, setRevenueData] = useState<any[]>([]);
    const [occupancyRate, setOccupancyRate] = useState<any[]>([]);
    const [recentAppointments, setRecentAppointments] = useState<any[]>([]);
    const [topProfessionals, setTopProfessionals] = useState<any[]>([]);

    useEffect(() => {
        fetchDashboardData();
    }, [period]);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // Em uma implementação real, você faria chamadas específicas para cada conjunto de dados
            // Aqui vamos simular os dados para demonstração

            // Simulação de estatísticas gerais
            const dashboardStats = {
                totalPatients: getRandomNumber(5000, 10000),
                newPatients: getRandomNumber(50, 200),
                totalProfessionals: getRandomNumber(100, 500),
                totalAppointments: getRandomNumber(1000, 5000),
                completedAppointments: getRandomNumber(800, 3000),
                cancelledAppointments: getRandomNumber(50, 200),
                revenue: getRandomNumber(50000, 200000),
                expenses: getRandomNumber(30000, 100000),
                profit: 0
            };

            // Calcula o lucro baseado na receita e despesas
            dashboardStats.profit = dashboardStats.revenue - dashboardStats.expenses;

            setStats(dashboardStats);

            // Simulação de dados para os gráficos
            generateChartData();

            // Simulação de consultas recentes
            generateRecentAppointments();

            // Simulação de profissionais com mais consultas
            generateTopProfessionals();

        } catch (error) {
            console.error('Erro ao buscar dados do dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const generateChartData = () => {
        // Gera dados de consultas por tipo
        const types = [
            { name: 'Consultas', value: getRandomNumber(300, 500) },
            { name: 'Retornos', value: getRandomNumber(200, 300) },
            { name: 'Telemedicina', value: getRandomNumber(100, 200) },
            { name: 'Exames', value: getRandomNumber(150, 250) },
            { name: 'Procedimentos', value: getRandomNumber(50, 150) }
        ];
        setAppointmentsByType(types);

        // Gera dados de receita por período
        const revenueByPeriod = [];

        if (period === 'week') {
            // Dados para a semana
            for (let i = 6; i >= 0; i--) {
                const date = subDays(new Date(), i);
                revenueByPeriod.push({
                    name: format(date, 'EEE', { locale: ptBR }),
                    receita: getRandomNumber(5000, 15000),
                    despesas: getRandomNumber(3000, 8000)
                });
            }
        } else if (period === 'month') {
            // Dados para o mês
            for (let i = 0; i < 30; i += 3) {
                const date = subDays(new Date(), i);
                revenueByPeriod.push({
                    name: format(date, 'dd/MM'),
                    receita: getRandomNumber(10000, 30000),
                    despesas: getRandomNumber(5000, 15000)
                });
            }
        } else {
            // Dados para o ano
            const months = [
                'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
                'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
            ];

            for (let i = 0; i < 12; i++) {
                revenueByPeriod.push({
                    name: months[i],
                    receita: getRandomNumber(30000, 90000),
                    despesas: getRandomNumber(15000, 50000)
                });
            }
        }

        setRevenueData(revenueByPeriod);

        // Gera dados de taxa de ocupação
        const occupancyData = [];

        if (period === 'week') {
            // Dados para a semana
            for (let i = 6; i >= 0; i--) {
                const date = subDays(new Date(), i);
                occupancyData.push({
                    name: format(date, 'EEE', { locale: ptBR }),
                    taxa: getRandomNumber(40, 90)
                });
            }
        } else if (period === 'month') {
            // Dados para o mês
            for (let i = 0; i < 30; i += 3) {
                const date = subDays(new Date(), i);
                occupancyData.push({
                    name: format(date, 'dd/MM'),
                    taxa: getRandomNumber(40, 90)
                });
            }
        } else {
            // Dados para o ano
            const months = [
                'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
                'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
            ];

            for (let i = 0; i < 12; i++) {
                occupancyData.push({
                    name: months[i],
                    taxa: getRandomNumber(40, 90)
                });
            }
        }

        setOccupancyRate(occupancyData);
    };

    const generateRecentAppointments = () => {
        const appointments = [];

        for (let i = 0; i < 5; i++) {
            const date = subDays(new Date(), getRandomNumber(0, 3));

            appointments.push({
                id: `app-${i + 1}`,
                patientName: ['João Silva', 'Maria Oliveira', 'Pedro Santos', 'Ana Costa', 'Carlos Ferreira'][getRandomNumber(0, 4)],
                professionalName: ['Dr. Roberto Martins', 'Dra. Juliana Alves', 'Dr. Ricardo Souza', 'Dra. Isabela Lima', 'Dr. Marcos Pereira'][getRandomNumber(0, 4)],
                specialty: ['Cardiologia', 'Ortopedia', 'Clínica Geral', 'Dermatologia', 'Oftalmologia'][getRandomNumber(0, 4)],
                date: format(date, 'dd/MM/yyyy'),
                time: `${getRandomNumber(8, 17)}:${['00', '15', '30', '45'][getRandomNumber(0, 3)]}`,
                status: ['scheduled', 'completed', 'cancelled'][getRandomNumber(0, 2)],
                type: ['consultation', 'return', 'telemedicine'][getRandomNumber(0, 2)]
            });
        }

        setRecentAppointments(appointments);
    };

    const generateTopProfessionals = () => {
        const professionals = [];

        for (let i = 0; i < 5; i++) {
            professionals.push({
                id: `prof-${i + 1}`,
                name: ['Dr. Roberto Martins', 'Dra. Juliana Alves', 'Dr. Ricardo Souza', 'Dra. Isabela Lima', 'Dr. Marcos Pereira'][i],
                specialty: ['Cardiologia', 'Ortopedia', 'Clínica Geral', 'Dermatologia', 'Oftalmologia'][i],
                appointmentsCount: getRandomNumber(50, 150),
                revenue: getRandomNumber(10000, 40000)
            });
        }

        // Ordena por quantidade de consultas (decrescente)
        professionals.sort((a, b) => b.appointmentsCount - a.appointmentsCount);

        setTopProfessionals(professionals);
    };

    const getRandomNumber = (min: number, max: number) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const formatCurrency = (value: number) => {
        return value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    };

    const getPeriodLabel = () => {
        switch (period) {
            case 'week':
                return 'Últimos 7 dias';
            case 'month':
                return 'Últimos 30 dias';
            case 'year':
                return 'Últimos 12 meses';
            default:
                return '';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'scheduled':
                return { label: 'Agendada', color: 'primary' };
            case 'completed':
                return { label: 'Realizada', color: 'success' };
            case 'cancelled':
                return { label: 'Cancelada', color: 'error' };
            default:
                return { label: status, color: 'default' };
        }
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleRefresh = () => {
        fetchDashboardData();
        handleMenuClose();
    };

    const handlePeriodChange = (event: any) => {
        setPeriod(event.target.value);
    };

    // Cores para gráficos
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Dashboard Administrativo
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <FormControl variant="outlined" size="small" sx={{ width: 150, mr: 2 }}>
                        <InputLabel id="period-select-label">Período</InputLabel>
                        <Select
                            labelId="period-select-label"
                            id="period-select"
                            value={period}
                            onChange={handlePeriodChange}
                            label="Período"
                        >
                            <MenuItem value="week">Semana</MenuItem>
                            <MenuItem value="month">Mês</MenuItem>
                            <MenuItem value="year">Ano</MenuItem>
                        </Select>
                    </FormControl>

                    <IconButton
                        aria-label="more"
                        aria-controls="dashboard-menu"
                        aria-haspopup="true"
                        onClick={handleMenuOpen}
                    >
                        <MoreVert />
                    </IconButton>
                    <Menu
                        id="dashboard-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        <MenuItem onClick={handleRefresh}>
                            <Refresh fontSize="small" sx={{ mr: 1 }} />
                            Atualizar Dados
                        </MenuItem>
                        <MenuItem onClick={handleMenuClose}>
                            <Print fontSize="small" sx={{ mr: 1 }} />
                            Imprimir Dashboard
                        </MenuItem>
                        <MenuItem onClick={handleMenuClose}>
                            <CloudDownload fontSize="small" sx={{ mr: 1 }} />
                            Exportar Relatórios
                        </MenuItem>
                    </Menu>
                </Box>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    {/* Cards de resumo */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card>
                                <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Total de Pacientes
                                        </Typography>
                                        <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>
                                            <People fontSize="small" />
                                        </Avatar>
                                    </Box>
                                    <Typography variant="h4" sx={{ mt: 1 }}>
                                        {stats.totalPatients.toLocaleString()}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
                                        <TrendingUp fontSize="small" color="success" />
                                        <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                                            +{stats.newPatients} novos
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                            neste mês
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <Card>
                                <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Consultas
                                        </Typography>
                                        <Avatar sx={{ bgcolor: 'info.main', width: 36, height: 36 }}>
                                            <MedicalServices fontSize="small" />
                                        </Avatar>
                                    </Box>
                                    <Typography variant="h4" sx={{ mt: 1 }}>
                                        {stats.totalAppointments.toLocaleString()}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
                                        <Typography variant="body2" sx={{ mr: 2 }}>
                                            <span style={{ color: 'green' }}>{stats.completedAppointments}</span> realizadas
                                        </Typography>
                                        <Typography variant="body2">
                                            <span style={{ color: 'red' }}>{stats.cancelledAppointments}</span> canceladas
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <Card>
                                <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Receita Total
                                        </Typography>
                                        <Avatar sx={{ bgcolor: 'success.main', width: 36, height: 36 }}>
                                            <AttachMoney fontSize="small" />
                                        </Avatar>
                                    </Box>
                                    <Typography variant="h4" sx={{ mt: 1 }}>
                                        {formatCurrency(stats.revenue)}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
                                        {stats.profit > 0 ? (
                                            <>
                                                <TrendingUp fontSize="small" color="success" />
                                                <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                                                    {formatCurrency(stats.profit)} de lucro
                                                </Typography>
                                            </>
                                        ) : (
                                            <>
                                                <TrendingDown fontSize="small" color="error" />
                                                <Typography variant="body2" color="error.main" sx={{ ml: 0.5 }}>
                                                    {formatCurrency(stats.profit)} de prejuízo
                                                </Typography>
                                            </>
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <Card>
                                <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Profissionais
                                        </Typography>
                                        <Avatar sx={{ bgcolor: 'warning.main', width: 36, height: 36 }}>
                                            <PersonAdd fontSize="small" />
                                        </Avatar>
                                    </Box>
                                    <Typography variant="h4" sx={{ mt: 1 }}>
                                        {stats.totalProfessionals.toLocaleString()}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
                                        <Button size="small" variant="outlined" startIcon={<Assessment />}>
                                            Ver Relatório
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Gráficos */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} md={8}>
                            <Paper sx={{ p: 2, height: '100%' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography variant="h6">Receitas e Despesas</Typography>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        {getPeriodLabel()}
                                    </Typography>
                                </Box>
                                <Box sx={{ height: 300 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={revenueData}
                                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <ChartTooltip formatter={(value) => formatCurrency(Number(value))} />
                                            <Legend />
                                            <Bar dataKey="receita" fill="#0088FE" name="Receita" />
                                            <Bar dataKey="despesas" fill="#FF8042" name="Despesas" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Box>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Paper sx={{ p: 2, height: '100%' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography variant="h6">Consultas por Tipo</Typography>
                                    <IconButton size="small">
                                        <FileDownload fontSize="small" />
                                    </IconButton>
                                </Box>
                                <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={appointmentsByType}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            >
                                                {appointmentsByType.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <ChartTooltip formatter={(value, name, props) => [value, name]} />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </Box>
                            </Paper>
                        </Grid>

                        <Grid item xs={12}>
                            <Paper sx={{ p: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography variant="h6">Taxa de Ocupação</Typography>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        {getPeriodLabel()}
                                    </Typography>
                                </Box>
                                <Box sx={{ height: 300 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart
                                            data={occupancyRate}
                                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                                            <ChartTooltip formatter={(value) => `${value}%`} />
                                            <Legend />
                                            <Line
                                                type="monotone"
                                                dataKey="taxa"
                                                stroke="#8884d8"
                                                name="Taxa de Ocupação"
                                                strokeWidth={2}
                                                activeDot={{ r: 8 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>

                    {/* Listas de informações */}
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Paper>
                                <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
                                    <Typography variant="h6">Consultas Recentes</Typography>
                                </Box>
                                <List>
                                    {recentAppointments.map((appointment) => {
                                        const statusInfo = getStatusLabel(appointment.status);
                                        return (
                                            <ListItem key={appointment.id} divider>
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        <Event />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Typography variant="subtitle2" sx={{ mr: 1 }}>
                                                                {appointment.patientName}
                                                            </Typography>
                                                            <Chip
                                                                label={statusInfo.label}
                                                                color={statusInfo.color as any}
                                                                size="small"
                                                            />
                                                        </Box>
                                                    }
                                                    secondary={
                                                        <>
                                                            <Typography variant="body2" component="span">
                                                                <Person fontSize="small" sx={{ fontSize: '0.8rem', verticalAlign: 'middle', mr: 0.5 }} />
                                                                {appointment.professionalName} - {appointment.specialty}
                                                            </Typography>
                                                            <br />
                                                            <Typography variant="body2" component="span">
                                                                <CalendarMonth fontSize="small" sx={{ fontSize: '0.8rem', verticalAlign: 'middle', mr: 0.5 }} />
                                                                {appointment.date} às {appointment.time}
                                                            </Typography>
                                                        </>
                                                    }
                                                />
                                            </ListItem>
                                        );
                                    })}
                                </List>
                                <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                                    <Button variant="outlined" startIcon={<Assessment />}>
                                        Ver Todos os Agendamentos
                                    </Button>
                                </Box>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Paper>
                                <Box sx={{ p: 2, bgcolor: 'secondary.main', color: 'white' }}>
                                    <Typography variant="h6">Profissionais com Mais Atendimentos</Typography>
                                </Box>
                                <List>
                                    {topProfessionals.map((professional, index) => (
                                        <ListItem key={professional.id} divider>
                                            <ListItemAvatar>
                                                <Avatar sx={{ bgcolor: COLORS[index % COLORS.length] }}>
                                                    {index + 1}
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={professional.name}
                                                secondary={
                                                    <>
                                                        <Typography variant="body2" component="span">
                                                            <MedicalServices fontSize="small" sx={{ fontSize: '0.8rem', verticalAlign: 'middle', mr: 0.5 }} />
                                                            {professional.specialty}
                                                        </Typography>
                                                        <br />
                                                        <Typography variant="body2" component="span">
                                                            <Event fontSize="small" sx={{ fontSize: '0.8rem', verticalAlign: 'middle', mr: 0.5 }} />
                                                            {professional.appointmentsCount} consultas
                                                        </Typography>
                                                    </>
                                                }
                                            />
                                            <ListItemSecondaryAction>
                                                <Typography variant="body2" color="success.main" fontWeight="bold">
                                                    {formatCurrency(professional.revenue)}
                                                </Typography>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    ))}
                                </List>
                                <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                                    <Button variant="outlined" color="secondary" startIcon={<Assessment />}>
                                        Relatório Completo
                                    </Button>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </>
            )}
        </Box>
    );
};

export default AdminDashboard; 