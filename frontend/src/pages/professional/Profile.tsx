import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid,
    IconButton,
    Paper,
    Stack,
    Tooltip,
    Typography,
    useMediaQuery,
    useTheme,
    Alert
} from '@mui/material';
import {
    AccountCircle,
    ArrowBack,
    Badge,
    CalendarMonth,
    Edit,
    Email,
    LocationOn,
    MedicalInformation,
    MedicalServices,
    Phone
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';

// Interface para o profissional com dados adicionais
interface ProfessionalData {
    id?: string;
    name: string;
    email: string;
    phone?: string;
    role?: string;
    specialty?: string;
    crm?: string;
    availableDays?: number[];
    startTime?: string;
    endTime?: string;
    appointmentDuration?: number;
    createdAt?: string;
}

// Interface para as consultas
interface Appointment {
    id: string;
    patientId: string;
    professionalId: string;
    date: string;
    status: string;
    type: string;
    notes: string;
}

const ProfessionalProfile = () => {
    const { user } = useAuth();
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
    const isExtraSmall = useMediaQuery('(max-width:400px)');
    const navigate = useNavigate();

    // Estados para armazenar os dados do profissional e o estado de carregamento
    const [professionalData, setProfessionalData] = useState<ProfessionalData | null>(null);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Buscar dados do profissional da API
    useEffect(() => {
        const fetchProfessionalData = async () => {
            // Se o usuário não estiver disponível, definir loading como false e mostrar mensagem apropriada
            if (!user) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                // Buscar dados do profissional
                const professionalResponse = await api.get(`/professionals?id=${user.id}`);
                if (professionalResponse.data && Array.isArray(professionalResponse.data) && professionalResponse.data.length > 0) {
                    setProfessionalData(professionalResponse.data[0]);
                } else {
                    setError('Dados do profissional não encontrados');
                }

                // Buscar consultas do profissional
                const appointmentsResponse = await api.get(`/appointments?professionalId=${user.id}`);
                if (appointmentsResponse.data && Array.isArray(appointmentsResponse.data)) {
                    setAppointments(appointmentsResponse.data);
                }
            } catch (err) {
                console.error('Erro ao buscar dados do profissional:', err);
                setError('Erro ao carregar dados do profissional. Por favor, tente novamente mais tarde.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfessionalData();
    }, [user]);

    // Encontrar a última consulta realizada e a próxima consulta
    const getLastAppointment = () => {
        const pastAppointments = appointments
            .filter(app => new Date(app.date) < new Date() && app.status === 'completed')
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        return pastAppointments.length > 0
            ? new Date(pastAppointments[0].date).toLocaleDateString()
            : 'Nenhuma consulta anterior';
    };

    const getNextAppointment = () => {
        const futureAppointments = appointments
            .filter(app => new Date(app.date) > new Date() && app.status === 'scheduled')
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        return futureAppointments.length > 0
            ? new Date(futureAppointments[0].date).toLocaleDateString()
            : 'Nenhuma consulta agendada';
    };

    const handleEdit = () => {
        // Em uma implementação real, isso abriria um formulário de edição
        alert('Funcionalidade de edição em desenvolvimento');
    };

    const handleBack = () => {
        navigate('/professional/dashboard');
    };

    // Formatar os dias da semana disponíveis
    const formatAvailableDays = (days?: number[]) => {
        if (!days || !days.length) return 'Não definido';

        const daysMap: Record<number, string> = {
            0: 'Domingo',
            1: 'Segunda',
            2: 'Terça',
            3: 'Quarta',
            4: 'Quinta',
            5: 'Sexta',
            6: 'Sábado'
        };

        return days.map(day => daysMap[day]).join(', ');
    };

    // Exibir estado de carregamento
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <Typography variant="h6" sx={{ ml: 2 }}>Carregando dados do profissional...</Typography>
            </Box>
        );
    }

    // Exibir mensagem de erro
    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
                <Button variant="contained" onClick={() => window.location.reload()}>
                    Tentar Novamente
                </Button>
            </Box>
        );
    }

    // Se não houver dados do profissional ou usuário
    if (!professionalData || !user) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="warning">
                    Não foi possível carregar os dados do profissional. Por favor, verifique se você está logado corretamente.
                </Alert>
            </Box>
        );
    }

    return (
        <Box sx={{
            width: '100%',
            px: { xs: 1, sm: 2, md: 3 },
            py: { xs: 2, sm: 3, md: 4 }
        }}>
            <Grid container spacing={3}>
                {/* Cabeçalho do perfil */}
                <Grid item xs={12}>
                    <Paper
                        elevation={2}
                        sx={{
                            p: { xs: 2, sm: 3 },
                            background: `linear-gradient(to right, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
                            color: 'white',
                            borderRadius: 2,
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                width: '150px',
                                height: '150px',
                                borderRadius: '0 0 0 100%',
                                bgcolor: 'rgba(255,255,255,0.1)',
                                display: { xs: 'none', md: 'block' }
                            }}
                        />

                        <Grid container alignItems="center" spacing={3}>
                            <Grid item xs={12} sm="auto">
                                <Avatar
                                    sx={{
                                        width: { xs: 80, sm: 100, md: 120 },
                                        height: { xs: 80, sm: 100, md: 120 },
                                        bgcolor: 'white',
                                        color: 'primary.main',
                                        border: '4px solid white',
                                        boxShadow: 2
                                    }}
                                >
                                    <MedicalServices sx={{ fontSize: { xs: 40, sm: 50, md: 60 } }} />
                                </Avatar>
                            </Grid>
                            <Grid item xs={12} sm>
                                <Box sx={{ position: 'relative' }}>
                                    <Typography
                                        variant={isExtraSmall ? "h5" : isSmall ? "h4" : "h3"}
                                        component="h1"
                                        fontWeight="bold"
                                        sx={{ mb: 0.5 }}
                                    >
                                        {professionalData.name}
                                    </Typography>

                                    <Stack
                                        direction={{ xs: 'column', sm: 'row' }}
                                        spacing={{ xs: 1, sm: 2 }}
                                        sx={{ mb: 1 }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Email fontSize="small" sx={{ mr: 0.5 }} />
                                            <Typography variant="body2">{professionalData.email}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Phone fontSize="small" sx={{ mr: 0.5 }} />
                                            <Typography variant="body2">{professionalData.phone || 'Não informado'}</Typography>
                                        </Box>
                                    </Stack>

                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <MedicalInformation fontSize="small" sx={{ mr: 0.5 }} />
                                        <Typography variant="body2">
                                            {professionalData.specialty || 'Especialidade não informada'}
                                            {professionalData.crm && ` - ${professionalData.crm}`}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ mt: 2, display: { xs: 'none', sm: 'block' } }}>
                                        <Chip
                                            label={professionalData.specialty ? `${professionalData.specialty}` : "Especialidade não informada"}
                                            color="secondary"
                                            size="small"
                                            icon={<MedicalServices />}
                                            sx={{ mr: 1, mb: 1 }}
                                        />
                                        <Chip
                                            label={`Cadastrado em: ${professionalData.createdAt ? new Date(professionalData.createdAt).toLocaleDateString() : 'Data desconhecida'}`}
                                            color="primary"
                                            variant="outlined"
                                            size="small"
                                            icon={<CalendarMonth />}
                                            sx={{ mr: 1, mb: 1, bgcolor: 'rgba(255,255,255,0.2)' }}
                                        />
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm="auto" sx={{ textAlign: 'right' }}>
                                <Tooltip title="Editar perfil">
                                    <IconButton
                                        onClick={handleEdit}
                                        sx={{
                                            bgcolor: 'white',
                                            color: 'primary.main',
                                            '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                                        }}
                                    >
                                        <Edit />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                {/* Informações pessoais */}
                <Grid item xs={12} md={6}>
                    <Card elevation={2} sx={{ height: '100%', borderRadius: 2 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Badge sx={{ color: 'primary.main', mr: 1 }} />
                                <Typography variant="h6">Informações Pessoais</Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Nome Completo</Typography>
                                    <Typography variant="body1" sx={{ mb: 2 }}>{professionalData.name}</Typography>

                                    <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                                    <Typography variant="body1" sx={{ mb: 2 }}>{professionalData.email}</Typography>

                                    <Typography variant="subtitle2" color="text.secondary">Telefone</Typography>
                                    <Typography variant="body1" sx={{ mb: 2 }}>{professionalData.phone || 'Não informado'}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Especialidade</Typography>
                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        {professionalData.specialty || 'Não informada'}
                                        {professionalData.specialty && (
                                            <Chip
                                                size="small"
                                                label={professionalData.specialty}
                                                color="primary"
                                                sx={{ ml: 1 }}
                                            />
                                        )}
                                    </Typography>

                                    <Typography variant="subtitle2" color="text.secondary">CRM</Typography>
                                    <Typography variant="body1" sx={{ mb: 2 }}>{professionalData.crm || 'Não informado'}</Typography>

                                    <Typography variant="subtitle2" color="text.secondary">Data de Cadastro</Typography>
                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        {professionalData.createdAt ? new Date(professionalData.createdAt).toLocaleDateString() : 'Data desconhecida'}
                                    </Typography>
                                </Grid>
                            </Grid>

                            <Box sx={{ mt: 2, textAlign: 'right' }}>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<Edit />}
                                    onClick={handleEdit}
                                >
                                    Editar Informações
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Informações de agenda */}
                <Grid item xs={12} md={6}>
                    <Card elevation={2} sx={{ height: '100%', borderRadius: 2 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <CalendarMonth sx={{ color: 'secondary.main', mr: 1 }} />
                                <Typography variant="h6">Informações de Agenda</Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />

                            <Typography variant="subtitle2" color="text.secondary">Dias Disponíveis</Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                {formatAvailableDays(professionalData.availableDays)}
                            </Typography>

                            <Typography variant="subtitle2" color="text.secondary">Horário de Atendimento</Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                {professionalData.startTime && professionalData.endTime
                                    ? `${professionalData.startTime} às ${professionalData.endTime}`
                                    : 'Não informado'
                                }
                            </Typography>

                            <Typography variant="subtitle2" color="text.secondary">Duração das Consultas</Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                {professionalData.appointmentDuration
                                    ? `${professionalData.appointmentDuration} minutos`
                                    : 'Não informado'
                                }
                            </Typography>

                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                bgcolor: 'primary.light',
                                color: 'white',
                                p: 2,
                                borderRadius: 1,
                                mt: 2
                            }}>
                                <Box>
                                    <Typography variant="caption">Última Consulta</Typography>
                                    <Typography variant="body2" fontWeight="bold">{getLastAppointment()}</Typography>
                                </Box>
                                <Divider orientation="vertical" flexItem sx={{ mx: 2, bgcolor: 'rgba(255,255,255,0.3)' }} />
                                <Box>
                                    <Typography variant="caption">Próxima Consulta</Typography>
                                    <Typography variant="body2" fontWeight="bold">{getNextAppointment()}</Typography>
                                </Box>
                            </Box>

                            <Box sx={{ mt: 3, textAlign: 'center' }}>
                                <Button
                                    variant="outlined"
                                    startIcon={<ArrowBack />}
                                    onClick={handleBack}
                                    fullWidth
                                >
                                    Voltar para Dashboard
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ProfessionalProfile; 