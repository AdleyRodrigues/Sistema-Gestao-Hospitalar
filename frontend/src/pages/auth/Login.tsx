import { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Paper,
    Avatar,
    FormControl,
    InputLabel,
    OutlinedInput,
    InputAdornment,
    IconButton,
    Alert,
    Fade,
    CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff, MedicalServices } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../hooks/useAuth';

// Schema de validação com Zod
const loginSchema = z.object({
    email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

// Tipo para os dados do formulário
type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
    const { login, loading } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    // Efeito para animação de entrada
    useEffect(() => {
        setMounted(true);
    }, []);

    // Configuração do React Hook Form com validação Zod
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        }
    });

    const onSubmit = async (data: LoginFormData) => {
        setLoginError(null);
        try {
            const success = await login(data.email, data.password);
            if (!success) {
                setLoginError('Credenciais inválidas. Tente novamente.');
            }
        } catch (error) {
            setLoginError('Ocorreu um erro ao fazer login. Tente novamente.');
        }
    };

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Container maxWidth={false} sx={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'background.default',
            backgroundImage: 'linear-gradient(135deg, #f5f7fa 0%, #e4efe9 100%)',
        }}>
            <Fade in={mounted} timeout={800}>
                <Paper
                    elevation={6}
                    sx={{
                        borderRadius: '16px',
                        overflow: 'hidden',
                        width: '100%',
                        maxWidth: '450px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    }}
                >
                    <Box sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        p: 3,
                        textAlign: 'center',
                        backgroundImage: 'linear-gradient(135deg, #1976D2 0%, #2196F3 100%)',
                    }}>
                        <Avatar
                            sx={{
                                m: '0 auto',
                                bgcolor: 'white',
                                color: 'primary.main',
                                width: 60,
                                height: 60,
                                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                            }}
                        >
                            <MedicalServices fontSize="large" />
                        </Avatar>
                        <Typography component="h1" variant="h4" sx={{ mt: 2, fontWeight: 700 }}>
                            VidaPlus
                        </Typography>
                        <Typography variant="subtitle1" sx={{ mt: 1, opacity: 0.9 }}>
                            Sistema de Gestão Hospitalar
                        </Typography>
                    </Box>

                    <Box sx={{ p: 4 }}>
                        {loginError && (
                            <Fade in={!!loginError}>
                                <Alert
                                    severity="error"
                                    sx={{
                                        mb: 3,
                                        borderRadius: '8px',
                                        animation: 'pulse 1.5s infinite',
                                        '@keyframes pulse': {
                                            '0%': { boxShadow: '0 0 0 0 rgba(220, 38, 38, 0.4)' },
                                            '70%': { boxShadow: '0 0 0 6px rgba(220, 38, 38, 0)' },
                                            '100%': { boxShadow: '0 0 0 0 rgba(220, 38, 38, 0)' },
                                        }
                                    }}
                                >
                                    {loginError}
                                </Alert>
                            </Fade>
                        )}

                        <Box
                            component="form"
                            onSubmit={handleSubmit(onSubmit)}
                            sx={{ width: '100%' }}
                        >
                            <TextField
                                margin="normal"
                                fullWidth
                                id="email"
                                label="Email"
                                autoComplete="email"
                                autoFocus
                                error={!!errors.email}
                                helperText={errors.email?.message}
                                InputProps={{
                                    sx: { borderRadius: 2 }
                                }}
                                {...register('email')}
                            />
                            <FormControl variant="outlined" fullWidth margin="normal">
                                <InputLabel htmlFor="password" error={!!errors.password}>
                                    Senha
                                </InputLabel>
                                <OutlinedInput
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    error={!!errors.password}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleTogglePasswordVisibility}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label="Senha"
                                    sx={{ borderRadius: 2 }}
                                    {...register('password')}
                                />
                                {errors.password && (
                                    <Typography variant="caption" color="error">
                                        {errors.password.message}
                                    </Typography>
                                )}
                            </FormControl>

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{
                                    mt: 3,
                                    mb: 2,
                                    py: 1.5,
                                    borderRadius: 2,
                                    fontWeight: 600,
                                    position: 'relative',
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 6px rgba(25, 118, 210, 0.25)',
                                    transition: 'all 0.3s',
                                    '&:hover': {
                                        boxShadow: '0 6px 10px rgba(25, 118, 210, 0.35)',
                                        transform: 'translateY(-2px)',
                                    },
                                    '&:active': {
                                        transform: 'translateY(0)',
                                    }
                                }}
                                disabled={loading}
                            >
                                {loading ? (
                                    <CircularProgress
                                        size={24}
                                        sx={{
                                            color: 'white',
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            marginTop: '-12px',
                                            marginLeft: '-12px',
                                        }}
                                    />
                                ) : 'Entrar'}
                            </Button>

                            <Box sx={{
                                mt: 3,
                                p: 2,
                                border: '1px dashed',
                                borderColor: 'divider',
                                borderRadius: 2,
                                bgcolor: 'rgba(0,0,0,0.02)'
                            }}>
                                <Typography variant="body2" align="center" color="text.secondary" sx={{ fontWeight: 500 }}>
                                    Dicas de login para teste:
                                </Typography>
                                <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
                                    • Email com "admin" = perfil administrador
                                </Typography>
                                <Typography variant="caption" display="block" color="text.secondary">
                                    • Email com "doctor" ou "professional" = perfil profissional
                                </Typography>
                                <Typography variant="caption" display="block" color="text.secondary">
                                    • Qualquer outro email = perfil paciente
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Paper>
            </Fade>
        </Container>
    );
};

export default Login; 