import { useState } from 'react';
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
    LocalHospital,
    MedicalServices,
    Phone,
    Security,
    Settings,
    SupervisorAccount
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Interface para o administrador com dados adicionais
interface AdminData {
    id?: string;
    name: string;
    email: string;
    role?: string;
    createdAt?: string;
    lastLogin?: string;
}

const AdminProfile = () => {
    const { user } = useAuth();
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
    const isExtraSmall = useMediaQuery('(max-width:400px)');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    if (!user) return null;

    const handleEdit = () => {
        // Em uma implementação real, isso abriria um formulário de edição
        alert('Funcionalidade de edição em desenvolvimento');
    };

    const handleBack = () => {
        navigate('/admin/dashboard');
    };

    const adminData: AdminData = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        lastLogin: new Date().toISOString() // Simulação de último login
    };

    // Caso estivesse carregando dados de uma API
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <Typography variant="h6" sx={{ ml: 2 }}>Carregando dados do administrador...</Typography>
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
                                    <SupervisorAccount sx={{ fontSize: { xs: 40, sm: 50, md: 60 } }} />
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
                                        {adminData.name}
                                    </Typography>

                                    <Stack
                                        direction={{ xs: 'column', sm: 'row' }}
                                        spacing={{ xs: 1, sm: 2 }}
                                        sx={{ mb: 1 }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Email fontSize="small" sx={{ mr: 0.5 }} />
                                            <Typography variant="body2">{adminData.email}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <SupervisorAccount fontSize="small" sx={{ mr: 0.5 }} />
                                            <Typography variant="body2">Administrador do Sistema</Typography>
                                        </Box>
                                    </Stack>

                                    <Box sx={{ mt: 2, display: { xs: 'none', sm: 'block' } }}>
                                        <Chip
                                            label="Administrador"
                                            color="secondary"
                                            size="small"
                                            icon={<SupervisorAccount />}
                                            sx={{ mr: 1, mb: 1 }}
                                        />
                                        <Chip
                                            label={`Cadastrado em: ${adminData.createdAt ? new Date(adminData.createdAt).toLocaleDateString() : 'Data desconhecida'}`}
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
                                    <Typography variant="body1" sx={{ mb: 2 }}>{adminData.name}</Typography>

                                    <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                                    <Typography variant="body1" sx={{ mb: 2 }}>{adminData.email}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Perfil</Typography>
                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        Administrador do Sistema
                                        <Chip
                                            size="small"
                                            label="Admin"
                                            color="primary"
                                            sx={{ ml: 1 }}
                                        />
                                    </Typography>

                                    <Typography variant="subtitle2" color="text.secondary">Data de Cadastro</Typography>
                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        {adminData.createdAt ? new Date(adminData.createdAt).toLocaleDateString() : 'Data desconhecida'}
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

                {/* Informações de sistema */}
                <Grid item xs={12} md={6}>
                    <Card elevation={2} sx={{ height: '100%', borderRadius: 2 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Settings sx={{ color: 'secondary.main', mr: 1 }} />
                                <Typography variant="h6">Informações do Sistema</Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />

                            <Typography variant="subtitle2" color="text.secondary">Último Acesso</Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                {adminData.lastLogin ? new Date(adminData.lastLogin).toLocaleString() : 'Não disponível'}
                            </Typography>

                            <Typography variant="subtitle2" color="text.secondary">Nível de Acesso</Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                Acesso Total ao Sistema
                                <Chip
                                    size="small"
                                    icon={<Security />}
                                    label="Acesso Total"
                                    color="secondary"
                                    sx={{ ml: 1 }}
                                />
                            </Typography>

                            <Typography variant="subtitle2" color="text.secondary">Status da Conta</Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                Ativo
                                <Chip
                                    size="small"
                                    label="Ativo"
                                    color="success"
                                    sx={{ ml: 1 }}
                                />
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
                                    <Typography variant="caption">Total de Usuários</Typography>
                                    <Typography variant="body2" fontWeight="bold">5</Typography>
                                </Box>
                                <Divider orientation="vertical" flexItem sx={{ mx: 2, bgcolor: 'rgba(255,255,255,0.3)' }} />
                                <Box>
                                    <Typography variant="caption">Profissionais Ativos</Typography>
                                    <Typography variant="body2" fontWeight="bold">3</Typography>
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

export default AdminProfile; 