import { useState, useEffect } from 'react';
import { User } from '../../types/auth';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
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
    Badge,
    Bloodtype,
    CalendarMonth,
    Edit,
    Email,
    LocationOn,
    MedicalInformation,
    Phone,
    ArrowBack
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/api';
import { useNavigate } from 'react-router-dom';

// Interface para o endereço do paciente
interface Address {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
}

// Interface estendida para o paciente com dados adicionais
interface PatientData extends User {
    phone?: string;
    bloodType?: string;
    createdAt?: string;
    birthDate?: string;
    gender?: string;
    address?: Address;
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

const PatientProfile = () => {
    const { user } = useAuth();
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
    const isExtraSmall = useMediaQuery('(max-width:400px)');
    const navigate = useNavigate();

    // Estados para armazenar os dados do paciente e o estado de carregamento
    const [patientData, setPatientData] = useState<PatientData | null>(null);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Buscar dados do paciente da API
    useEffect(() => {
        const fetchPatientData = async () => {
            // Se o usuário não estiver disponível, definir loading como false e mostrar mensagem apropriada
            if (!user) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                // Buscar dados do paciente
                const patientResponse = await api.get(`/patients?id=${user.id}`);
                if (patientResponse.data && Array.isArray(patientResponse.data) && patientResponse.data.length > 0) {
                    setPatientData(patientResponse.data[0]);
                } else {
                    setError('Dados do paciente não encontrados');
                }

                // Buscar consultas do paciente
                const appointmentsResponse = await api.get(`/appointments?patientId=${user.id}`);
                if (appointmentsResponse.data && Array.isArray(appointmentsResponse.data)) {
                    setAppointments(appointmentsResponse.data);
                }
            } catch (err) {
                console.error('Erro ao buscar dados do paciente:', err);
                setError('Erro ao carregar dados do paciente. Por favor, tente novamente mais tarde.');
            } finally {
                setLoading(false);
            }
        };

        fetchPatientData();
    }, [user]);

    // Adicionar um timeout para evitar carregamento infinito
    useEffect(() => {
        // Se ainda estiver carregando após 10 segundos, definir loading como false
        const timeoutId = setTimeout(() => {
            if (loading) {
                setLoading(false);
                setError('Tempo limite excedido ao carregar dados. Por favor, tente novamente.');
            }
        }, 10000); // 10 segundos de timeout

        return () => clearTimeout(timeoutId);
    }, [loading]);

    const handleEdit = () => {
        // Em uma implementação real, isso abriria um formulário de edição
        alert('Funcionalidade de edição em desenvolvimento');
    };

    // Formatar endereço completo
    const formatAddress = (address?: Address) => {
        if (!address) return 'Endereço não informado';
        return `${address.street}, ${address.number} - ${address.neighborhood}, ${address.city}/${address.state}`;
    };

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

    // Exibir estado de carregamento
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ ml: 2 }}>Carregando dados do paciente...</Typography>
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

    // Se não houver dados do paciente ou usuário
    if (!patientData || !user) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="warning">
                    Não foi possível carregar os dados do paciente. Por favor, verifique se você está logado corretamente.
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
                                    <AccountCircle sx={{ fontSize: { xs: 60, sm: 80, md: 100 } }} />
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
                                        {patientData.name}
                                    </Typography>

                                    <Stack
                                        direction={{ xs: 'column', sm: 'row' }}
                                        spacing={{ xs: 1, sm: 2 }}
                                        sx={{ mb: 1 }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Email fontSize="small" sx={{ mr: 0.5 }} />
                                            <Typography variant="body2">{patientData.email}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Phone fontSize="small" sx={{ mr: 0.5 }} />
                                            <Typography variant="body2">{patientData.phone || 'Não informado'}</Typography>
                                        </Box>
                                    </Stack>

                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <LocationOn fontSize="small" sx={{ mr: 0.5 }} />
                                        <Typography variant="body2">{formatAddress(patientData.address)}</Typography>
                                    </Box>

                                    <Box sx={{ mt: 2, display: { xs: 'none', sm: 'block' } }}>
                                        <Chip
                                            label={patientData.bloodType ? `Tipo Sanguíneo: ${patientData.bloodType}` : "Tipo Sanguíneo não informado"}
                                            color={patientData.bloodType ? "secondary" : "default"}
                                            size="small"
                                            icon={<Bloodtype />}
                                            sx={{ mr: 1, mb: 1 }}
                                        />
                                        <Chip
                                            label={`Cadastrado em: ${patientData.createdAt ? new Date(patientData.createdAt).toLocaleDateString() : 'Data desconhecida'}`}
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
                                    <Typography variant="body1" sx={{ mb: 2 }}>{patientData.name}</Typography>

                                    <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                                    <Typography variant="body1" sx={{ mb: 2 }}>{patientData.email}</Typography>

                                    <Typography variant="subtitle2" color="text.secondary">Telefone</Typography>
                                    <Typography variant="body1" sx={{ mb: 2 }}>{patientData.phone || 'Não informado'}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Tipo Sanguíneo</Typography>
                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        {patientData.bloodType || 'Não informado'}
                                        {patientData.bloodType && (
                                            <Chip
                                                size="small"
                                                label={patientData.bloodType}
                                                color="error"
                                                sx={{ ml: 1 }}
                                            />
                                        )}
                                    </Typography>

                                    <Typography variant="subtitle2" color="text.secondary">Endereço</Typography>
                                    <Typography variant="body1" sx={{ mb: 2 }}>{formatAddress(patientData.address)}</Typography>

                                    <Typography variant="subtitle2" color="text.secondary">Data de Cadastro</Typography>
                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        {patientData.createdAt ? new Date(patientData.createdAt).toLocaleDateString() : 'Data desconhecida'}
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

                {/* Informações médicas */}
                <Grid item xs={12} md={6}>
                    <Card elevation={2} sx={{ height: '100%', borderRadius: 2 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <MedicalInformation sx={{ color: 'secondary.main', mr: 1 }} />
                                <Typography variant="h6">Informações Médicas</Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />

                            <Typography variant="subtitle2" color="text.secondary">Tipo Sanguíneo</Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                {patientData.bloodType || 'Não informado'}
                                {patientData.bloodType && (
                                    <Chip
                                        size="small"
                                        label={patientData.bloodType}
                                        color="error"
                                        sx={{ ml: 1 }}
                                    />
                                )}
                            </Typography>

                            <Typography variant="subtitle2" color="text.secondary">Gênero</Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                {patientData.gender === 'male' ? 'Masculino' :
                                    patientData.gender === 'female' ? 'Feminino' :
                                        'Não informado'}
                            </Typography>

                            <Typography variant="subtitle2" color="text.secondary">Data de Nascimento</Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                {patientData.birthDate ? new Date(patientData.birthDate).toLocaleDateString() : 'Não informada'}
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
                                    onClick={() => navigate('/patient/dashboard')}
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

export default PatientProfile;