import {
    Assessment,
    AttachMoney,
    CalendarMonth,
    CloudDownload,
    Event,
    FileDownload,
    MedicalServices,
    MoreVert,
    People,
    Person,
    PersonAdd,
    Print,
    Refresh,
    TrendingDown,
    TrendingUp
} from '@mui/icons-material';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    List,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
    Menu,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    Typography
} from '@mui/material';
import { format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import React, { useEffect, useState } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Tooltip as ChartTooltip,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    XAxis,
    YAxis
} from 'recharts';
import { useAuth } from '../../../hooks/useAuth';
import { api } from '../../../services/api';

// Interfaces para os tipos de dados
interface AppointmentByType {
    name: string;
    value: number;
}

interface RevenueData {
    name: string;
    receita: number;
    despesas: number;
}

interface OccupancyData {
    name: string;
    taxa: number;
}

interface Appointment {
    id: string;
    patientName: string;
    professionalName: string;
    specialty: string;
    date: string;
    time: string;
    status: 'scheduled' | 'completed' | 'cancelled';
    type: 'consultation' | 'return' | 'telemedicine';
}

interface Professional {
    id: string;
    name: string;
    specialty: string;
    appointmentsCount: number;
    revenue: number;
}

const AdminDashboard = () => {
    useAuth();
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
    const [appointmentsByType, setAppointmentsByType] = useState<AppointmentByType[]>([]);
    const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
    const [occupancyRate, setOccupancyRate] = useState<OccupancyData[]>([]);
    const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);
    const [topProfessionals, setTopProfessionals] = useState<Professional[]>([]);

    useEffect(() => {
        fetchDashboardData();
    }, [period]);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // Buscar dados reais da API
            const [
                patientsResponse,
                professionalsResponse,
                appointmentsResponse,
                financialResponse
            ] = await Promise.all([
                api.get('/patients'),
                api.get('/professionals'),
                api.get('/appointments'),
                api.get('/financial_data')
            ]);

            const patients = patientsResponse.data || [];
            const professionals = professionalsResponse.data || [];
            const appointments = appointmentsResponse.data || [];
            const financialData = financialResponse.data || [];

            // Log para depuração dos dados financeiros
            console.log('Dados financeiros recebidos:', {
                total: financialData.length,
                primeiroItem: financialData.length > 0 ? financialData[0] : null,
                temDados: financialData.length > 0
            });

            // Verificar o ano dos dados
            if (financialData.length > 0) {
                // Verificar ano das primeiras 3 entradas
                const amostra = financialData.slice(0, 3);
                console.log('Amostra de datas para verificação de ano:',
                    amostra.map((item: any) => ({
                        id: item.id,
                        date: item.date,
                        ano: new Date(item.date).getFullYear()
                    }))
                );
            }

            // Calcular estatísticas baseadas nos dados reais
            const now = new Date();
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

            // Contagem de novos pacientes (no último mês)
            const newPatientsCount = patients.filter((patient: any) => {
                const createdAt = new Date(patient.createdAt);
                return createdAt >= oneMonthAgo;
            }).length;

            // Contagem de consultas por status
            const completedAppointmentsCount = appointments.filter(
                (app: any) => app.status === 'completed'
            ).length;

            const cancelledAppointmentsCount = appointments.filter(
                (app: any) => app.status === 'canceled'
            ).length;

            // Calcular dados financeiros
            const income = financialData
                .filter((item: any) => item.type === 'income')
                .reduce((sum: number, item: any) => sum + item.amount, 0);

            const expenses = financialData
                .filter((item: any) => item.type === 'expense')
                .reduce((sum: number, item: any) => sum + item.amount, 0);

            const dashboardStats = {
                totalPatients: patients.length,
                newPatients: newPatientsCount,
                totalProfessionals: professionals.length,
                totalAppointments: appointments.length,
                completedAppointments: completedAppointmentsCount,
                cancelledAppointments: cancelledAppointmentsCount,
                revenue: income,
                expenses: expenses,
                profit: income - expenses
            };

            setStats(dashboardStats);

            // Gerar dados para os gráficos baseados em dados reais
            generateRealChartData(appointments, financialData);

            // Gerar dados de consultas recentes
            generateRealRecentAppointments(appointments, patients, professionals);

            // Gerar dados de profissionais com mais consultas
            generateRealTopProfessionals(appointments, professionals, financialData);

        } catch (error) {
            console.error('Erro ao buscar dados do dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const generateRealChartData = (appointments: any[], financialData: any[]) => {
        // Contagem de consultas por tipo
        const consultations = appointments.filter((app: any) => app.type === 'consultation').length;
        const returns = appointments.filter((app: any) => app.type === 'return').length;
        const telemedicine = appointments.filter((app: any) => app.type === 'telemedicine').length;

        const types = [
            { name: 'Consultas', value: consultations },
            { name: 'Retornos', value: returns },
            { name: 'Telemedicina', value: telemedicine }
        ];
        setAppointmentsByType(types);

        // Dados de receita por período
        const revenueByPeriod: RevenueData[] = [];

        // Função para filtrar por data
        const filterByDate = (data: any[], startDate: Date, endDate: Date) => {
            console.log('Filtrando dados:', {
                totalDados: data.length,
                periodo: period,
                dataInicial: startDate.toISOString(),
                dataFinal: endDate.toISOString()
            });

            // Se não houver dados, retornar array vazio
            if (!data || data.length === 0) {
                console.log('Não há dados para filtrar');
                return [];
            }

            // Verificar formato de data dos itens
            if (data.length > 0) {
                const primeiroItem = data[0];
                console.log('Formato de data do primeiro item:', {
                    id: primeiroItem.id,
                    date: primeiroItem.date,
                    tipo: typeof primeiroItem.date
                });
            }

            return data.filter((item: any) => {
                // Garantir que o item tem propriedade date
                if (!item.date) {
                    console.log('Item sem data:', item);
                    return false;
                }

                try {
                    // Converter a data do item para um objeto Date
                    // Se a data for uma string no formato "YYYY-MM-DD", precisamos tratar corretamente
                    let itemDate: Date;
                    if (typeof item.date === 'string') {
                        // Converter string para Date, assumindo formato ISO ou YYYY-MM-DD
                        itemDate = new Date(item.date);

                        // Se não inclui hora e é apenas YYYY-MM-DD, define para meio-dia para evitar erros de fuso
                        if (item.date.length === 10 && item.date.includes('-')) {
                            itemDate.setHours(12, 0, 0, 0);
                        }
                    } else {
                        itemDate = item.date;
                    }

                    // Verificar se a data é válida
                    if (isNaN(itemDate.getTime())) {
                        console.log('Data inválida:', {
                            id: item.id,
                            date: item.date
                        });
                        return false;
                    }

                    // Comparar datas usando getTime() para maior precisão
                    const inRange =
                        itemDate.getTime() >= startDate.getTime() &&
                        itemDate.getTime() <= endDate.getTime();

                    // Para depuração
                    console.log('Filtrando item:', {
                        id: item.id,
                        original: item.date,
                        parsed: itemDate.toISOString(),
                        start: startDate.toISOString(),
                        end: endDate.toISOString(),
                        isInRange: inRange
                    });

                    return inRange;
                } catch (error) {
                    console.error('Erro ao processar data:', error, item);
                    return false;
                }
            });
        };

        if (period === 'week') {
            // Dados para a semana
            for (let i = 6; i >= 0; i--) {
                // Criar data base de 2024 (mesmo ano dos dados) em vez de usar new Date()
                const today = new Date();
                const date = new Date(2024, today.getMonth(), today.getDate());
                date.setDate(date.getDate() - i);

                const startOfDay = new Date(date);
                startOfDay.setHours(0, 0, 0, 0);

                const endOfDay = new Date(date);
                endOfDay.setHours(23, 59, 59, 999);

                console.log(`Filtrando semana - dia ${i}:`, {
                    startOfDay: startOfDay.toISOString(),
                    endOfDay: endOfDay.toISOString()
                });

                const dayIncome = filterByDate(
                    financialData.filter((item: any) => item.type === 'income'),
                    startOfDay,
                    endOfDay
                ).reduce((sum: number, item: any) => sum + item.amount, 0);

                const dayExpenses = filterByDate(
                    financialData.filter((item: any) => item.type === 'expense'),
                    startOfDay,
                    endOfDay
                ).reduce((sum: number, item: any) => sum + item.amount, 0);

                revenueByPeriod.push({
                    name: format(date, 'EEE', { locale: ptBR }),
                    receita: dayIncome,
                    despesas: dayExpenses
                });
            }
        } else if (period === 'month') {
            // Dados para o mês (agrupados a cada 3 dias)
            for (let i = 0; i < 30; i += 3) {
                // Criar data base de 2024 (mesmo ano dos dados) em vez de usar new Date()
                const today = new Date();
                const baseDate = new Date(2024, today.getMonth(), today.getDate());
                const endDate = new Date(baseDate);
                endDate.setDate(endDate.getDate() - i);

                const startDate = new Date(endDate);
                startDate.setDate(startDate.getDate() - 2);

                // Log de datas para depuração
                console.log(`Período ${i / 3 + 1}:`, {
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString()
                });

                const filteredIncome = filterByDate(
                    financialData.filter((item: any) => item.type === 'income'),
                    startDate,
                    endDate
                );

                const filteredExpenses = filterByDate(
                    financialData.filter((item: any) => item.type === 'expense'),
                    startDate,
                    endDate
                );

                // Log dos resultados filtrados
                console.log(`Resultado da filtragem para período ${i / 3 + 1}:`, {
                    totalIncome: filteredIncome.length,
                    totalExpenses: filteredExpenses.length,
                    valorReceita: filteredIncome.reduce((sum: number, item: any) => sum + item.amount, 0),
                    valorDespesas: filteredExpenses.reduce((sum: number, item: any) => sum + item.amount, 0)
                });

                const periodIncome = filteredIncome.reduce((sum: number, item: any) => sum + item.amount, 0);
                const periodExpenses = filteredExpenses.reduce((sum: number, item: any) => sum + item.amount, 0);

                revenueByPeriod.push({
                    name: format(endDate, 'dd/MM'),
                    receita: periodIncome,
                    despesas: periodExpenses
                });
            }
        } else {
            // Dados para o ano (agrupados por mês)
            const months = [
                'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
                'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
            ];

            // Usar ano fixo 2024 para todos os dados
            const currentYear = 2024;

            for (let i = 0; i < 12; i++) {
                const startDate = new Date(currentYear, i, 1);
                const endDate = new Date(currentYear, i + 1, 0);

                // Log para depuração do ano
                console.log(`Mês ${months[i]}:`, {
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString()
                });

                const monthIncome = filterByDate(
                    financialData.filter((item: any) => item.type === 'income'),
                    startDate,
                    endDate
                ).reduce((sum: number, item: any) => sum + item.amount, 0);

                const monthExpenses = filterByDate(
                    financialData.filter((item: any) => item.type === 'expense'),
                    startDate,
                    endDate
                ).reduce((sum: number, item: any) => sum + item.amount, 0);

                revenueByPeriod.push({
                    name: months[i],
                    receita: monthIncome,
                    despesas: monthExpenses
                });
            }
        }

        setRevenueData(revenueByPeriod);
        console.log('Dados finais para o gráfico de Receitas e Despesas:', revenueByPeriod);

        // Calcular taxa de ocupação baseado nas consultas agendadas vs capacidade total
        const occupancyData: OccupancyData[] = [];

        if (period === 'week') {
            for (let i = 6; i >= 0; i--) {
                // Criar data base de 2024 (mesmo ano dos dados) em vez de usar new Date()
                const today = new Date();
                const date = new Date(2024, today.getMonth(), today.getDate());
                date.setDate(date.getDate() - i);

                const startOfDay = new Date(date);
                startOfDay.setHours(0, 0, 0, 0);

                const endOfDay = new Date(date);
                endOfDay.setHours(23, 59, 59, 999);

                // Contar consultas no dia
                const dayAppointments = filterByDate(appointments, startOfDay, endOfDay).length;

                // Estimar capacidade total baseada no número de profissionais
                // Assumindo 8 horas por dia e média de 30 min por consulta = 16 slots por profissional
                const capacity = 16 * stats.totalProfessionals;

                // Evitar divisão por zero
                const rate = capacity > 0 ? (dayAppointments / capacity) * 100 : 0;

                occupancyData.push({
                    name: format(date, 'EEE', { locale: ptBR }),
                    taxa: Math.min(Math.round(rate), 100) // Garantir máximo de 100%
                });
            }
        } else if (period === 'month') {
            for (let i = 0; i < 30; i += 3) {
                // Criar data base de 2024 (mesmo ano dos dados) em vez de usar new Date()
                const today = new Date();
                const baseDate = new Date(2024, today.getMonth(), today.getDate());
                const endDate = new Date(baseDate);
                endDate.setDate(endDate.getDate() - i);

                const startDate = new Date(endDate);
                startDate.setDate(startDate.getDate() - 2);

                const periodAppointments = filterByDate(appointments, startDate, endDate).length;
                const capacity = 16 * 3 * stats.totalProfessionals; // 3 dias
                const rate = capacity > 0 ? (periodAppointments / capacity) * 100 : 0;

                occupancyData.push({
                    name: format(endDate, 'dd/MM'),
                    taxa: Math.min(Math.round(rate), 100)
                });
            }
        } else {
            const months = [
                'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
                'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
            ];

            // Usar ano fixo 2024 para todos os dados
            const currentYear = 2024;

            for (let i = 0; i < 12; i++) {
                const startDate = new Date(currentYear, i, 1);
                const endDate = new Date(currentYear, i + 1, 0);
                const daysInMonth = endDate.getDate();

                const monthAppointments = filterByDate(appointments, startDate, endDate).length;
                const capacity = 16 * daysInMonth * stats.totalProfessionals;
                const rate = capacity > 0 ? (monthAppointments / capacity) * 100 : 0;

                occupancyData.push({
                    name: months[i],
                    taxa: Math.min(Math.round(rate), 100)
                });
            }
        }

        setOccupancyRate(occupancyData);
        console.log('Dados finais para o gráfico de Taxa de Ocupação:', occupancyData);
    };

    const generateRealRecentAppointments = (appointments: any[], patients: any[], professionals: any[]) => {
        // Criar mapas para rápido acesso
        const patientMap = new Map();
        patients.forEach((patient: any) => {
            patientMap.set(patient.id, patient.name);
        });

        const professionalMap = new Map();
        professionals.forEach((prof: any) => {
            professionalMap.set(prof.id, {
                name: prof.name,
                specialty: prof.specialty
            });
        });

        // Ordenar consultas por data (mais recentes primeiro)
        const sortedAppointments = [...appointments].sort((a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        // Pegar as 5 consultas mais recentes
        const recentApps = sortedAppointments.slice(0, 5).map((app: any) => {
            const appointmentDate = new Date(app.date);
            const professional = professionalMap.get(app.professionalId) || {};

            return {
                id: app.id,
                patientName: patientMap.get(app.patientId) || 'Paciente não encontrado',
                professionalName: professional.name || 'Profissional não encontrado',
                specialty: professional.specialty || 'Especialidade não definida',
                date: format(appointmentDate, 'dd/MM/yyyy'),
                time: format(appointmentDate, 'HH:mm'),
                status: app.status || 'scheduled',
                type: app.type || 'consultation'
            };
        });

        setRecentAppointments(recentApps);
    };

    const generateRealTopProfessionals = (appointments: any[], professionals: any[], financialData: any[]) => {
        // Contar consultas por profissional
        const appointmentCounts = new Map();
        appointments.forEach((app: any) => {
            const profId = app.professionalId;
            appointmentCounts.set(profId, (appointmentCounts.get(profId) || 0) + 1);
        });

        // Calcular receita por profissional
        const revenueByProfessional = new Map();
        financialData
            .filter((item: any) => item.type === 'income' && item.professionalId)
            .forEach((item: any) => {
                const profId = item.professionalId;
                revenueByProfessional.set(profId, (revenueByProfessional.get(profId) || 0) + item.amount);
            });

        // Criar lista de profissionais com estatísticas
        const professionalsWithStats = professionals.map((prof: any) => ({
            id: prof.id,
            name: prof.name,
            specialty: prof.specialty,
            appointmentsCount: appointmentCounts.get(prof.id) || 0,
            revenue: revenueByProfessional.get(prof.id) || 0
        }));

        // Ordenar por número de consultas (decrescente)
        const sortedProfessionals = professionalsWithStats.sort(
            (a, b) => b.appointmentsCount - a.appointmentsCount
        );

        // Pegar os 5 profissionais com mais consultas
        setTopProfessionals(sortedProfessionals.slice(0, 5));
    };

    // Função auxiliar para valores aleatórios - usada apenas quando não há dados suficientes
    const getRandomNumber = (min: number, max: number) => {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    // Formatar valores monetários
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

    const getStatusLabel = (status: string): { label: string; color: 'primary' | 'success' | 'error' | 'default' } => {
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

    const handlePeriodChange = (event: SelectChangeEvent) => {
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
                                            <ChartTooltip formatter={(value, name) => [value, name]} />
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
                                                                color={statusInfo.color}
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