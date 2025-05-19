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
    Link,
    useMediaQuery,
    useTheme,
    Select,
    MenuItem,
    FormHelperText,
    Stepper,
    Step,
    StepLabel,
} from '@mui/material';
import { Visibility, VisibilityOff, MedicalServices, PersonAdd } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import ConsentModal from '../../components/privacy/ConsentModal';

// Schema de validação para o formulário básico
const baseSchema = z.object({
    name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
    email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
    confirmPassword: z.string().min(6, 'Confirme sua senha'),
    userType: z.enum(['paciente', 'profissional']),
}).refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
});

// Schema adicional para pacientes
const patientSchema = z.object({
    birthDate: z.string().min(1, 'Data de nascimento é obrigatória'),
    gender: z.enum(['masculino', 'feminino', 'outro', 'prefiro_nao_informar']),
    bloodType: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'nao_sei']).optional(),
});

// Schema adicional para profissionais
const professionalSchema = z.object({
    specialty: z.string().min(1, 'Especialidade é obrigatória'),
    crm: z.string().min(4, 'CRM/Registro profissional inválido'),
});

// União dos schemas conforme o tipo de usuário
const registerSchema = z.discriminatedUnion('userType', [
    z.object({
        userType: z.literal('paciente'),
        ...baseSchema.shape,
        ...patientSchema.shape,
    }),
    z.object({
        userType: z.literal('profissional'),
        ...baseSchema.shape,
        ...professionalSchema.shape,
    }),
]);

// Tipo para os dados do formulário
type RegisterFormData = z.infer<typeof registerSchema>;

const Register = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [registerError, setRegisterError] = useState<string | null>(null);
    const [registerSuccess, setRegisterSuccess] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [showConsentModal, setShowConsentModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [userType, setUserType] = useState<'paciente' | 'profissional'>('paciente');

    // Efeito para animação de entrada
    useEffect(() => {
        setMounted(true);
    }, []);

    // Configuração do React Hook Form
    const {
        register,
        handleSubmit,
        control,
        watch,
        trigger,
        formState: { errors, isValid }
    } = useForm<RegisterFormData>({
        resolver: zodResolver(baseSchema),
        mode: 'onChange',
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            userType: 'paciente',
        }
    });

    // Observar o tipo de usuário para alternar entre os formulários
    const watchUserType = watch('userType');

    // Passos do cadastro
    const steps = [
        'Informações básicas',
        watchUserType === 'paciente' ? 'Informações do paciente' : 'Informações profissionais',
        'Conclusão'
    ];

    const handleNextStep = async () => {
        const isStepValid = await trigger();
        if (isStepValid) {
            setActiveStep((prevStep) => prevStep + 1);
        }
    };

    const handleBackStep = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    const handleRegister = async (data: RegisterFormData) => {
        setRegisterError(null);
        setLoading(true);

        try {
            // Chamada para a API de registro
            const response = await fetch('http://localhost:3001/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao registrar usuário');
            }

            const result = await response.json();

            // Registro bem-sucedido
            setRegisterSuccess(true);
            setShowConsentModal(true);
        } catch (error) {
            setRegisterError(error instanceof Error ? error.message : 'Ocorreu um erro ao realizar o cadastro. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleToggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleConsentAccept = () => {
        // Redirecionar para o login após aceitar os termos
        navigate('/login', {
            state: {
                registerSuccess: true,
                userType: watchUserType,
                message: watchUserType === 'profissional'
                    ? 'Cadastro realizado com sucesso! Aguarde a aprovação do administrador para acessar o sistema.'
                    : 'Cadastro realizado com sucesso! Faça login para acessar o sistema.'
            }
        });
    };

    const handleConsentDecline = () => {
        setShowConsentModal(false);
        setRegisterError('Para utilizar o sistema, é necessário aceitar a Política de Privacidade.');
    };

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handlePrivacyPolicyClick = () => {
        navigate('/privacy-policy');
    };

    // Renderiza o formulário conforme o passo atual
    const renderStepContent = () => {
        switch (activeStep) {
            case 0:
                return (
                    <>
                        <TextField
                            margin="normal"
                            fullWidth
                            id="name"
                            label="Nome completo"
                            autoComplete="name"
                            autoFocus
                            error={!!errors.name}
                            helperText={errors.name?.message}
                            InputProps={{
                                sx: { borderRadius: 2 }
                            }}
                            sx={{ mb: { xs: 1.5, sm: 2 } }}
                            {...register('name')}
                        />

                        <TextField
                            margin="normal"
                            fullWidth
                            id="email"
                            label="Email"
                            autoComplete="email"
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            InputProps={{
                                sx: { borderRadius: 2 }
                            }}
                            sx={{ mb: { xs: 1.5, sm: 2 } }}
                            {...register('email')}
                        />

                        <FormControl variant="outlined" fullWidth margin="normal" sx={{ mb: { xs: 1.5, sm: 2 } }}>
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
                                            size={isMobile ? "small" : "medium"}
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
                                <FormHelperText error>
                                    {errors.password.message}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl variant="outlined" fullWidth margin="normal" sx={{ mb: { xs: 1.5, sm: 2 } }}>
                            <InputLabel htmlFor="confirmPassword" error={!!errors.confirmPassword}>
                                Confirmar Senha
                            </InputLabel>
                            <OutlinedInput
                                id="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                error={!!errors.confirmPassword}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle confirm password visibility"
                                            onClick={handleToggleConfirmPasswordVisibility}
                                            edge="end"
                                            size={isMobile ? "small" : "medium"}
                                        >
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Confirmar Senha"
                                sx={{ borderRadius: 2 }}
                                {...register('confirmPassword')}
                            />
                            {errors.confirmPassword && (
                                <FormHelperText error>
                                    {errors.confirmPassword.message}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl fullWidth margin="normal" sx={{ mb: { xs: 1.5, sm: 2 } }}>
                            <InputLabel id="userType-label">Tipo de Usuário</InputLabel>
                            <Controller
                                name="userType"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        labelId="userType-label"
                                        id="userType"
                                        label="Tipo de Usuário"
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setUserType(e.target.value as 'paciente' | 'profissional');
                                        }}
                                    >
                                        <MenuItem value="paciente">Paciente</MenuItem>
                                        <MenuItem value="profissional">Profissional de Saúde</MenuItem>
                                    </Select>
                                )}
                            />
                        </FormControl>
                    </>
                );

            case 1:
                return watchUserType === 'paciente' ? (
                    <>
                        <TextField
                            margin="normal"
                            fullWidth
                            id="birthDate"
                            label="Data de Nascimento"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.birthDate}
                            helperText={errors.birthDate?.message}
                            InputProps={{
                                sx: { borderRadius: 2 }
                            }}
                            sx={{ mb: { xs: 1.5, sm: 2 } }}
                            {...register('birthDate')}
                        />

                        <FormControl fullWidth margin="normal" sx={{ mb: { xs: 1.5, sm: 2 } }}>
                            <InputLabel id="gender-label">Gênero</InputLabel>
                            <Controller
                                name="gender"
                                control={control}
                                defaultValue="prefiro_nao_informar"
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        labelId="gender-label"
                                        id="gender"
                                        label="Gênero"
                                    >
                                        <MenuItem value="masculino">Masculino</MenuItem>
                                        <MenuItem value="feminino">Feminino</MenuItem>
                                        <MenuItem value="outro">Outro</MenuItem>
                                        <MenuItem value="prefiro_nao_informar">Prefiro não informar</MenuItem>
                                    </Select>
                                )}
                            />
                        </FormControl>

                        <FormControl fullWidth margin="normal" sx={{ mb: { xs: 1.5, sm: 2 } }}>
                            <InputLabel id="bloodType-label">Tipo Sanguíneo (opcional)</InputLabel>
                            <Controller
                                name="bloodType"
                                control={control}
                                defaultValue="nao_sei"
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        labelId="bloodType-label"
                                        id="bloodType"
                                        label="Tipo Sanguíneo (opcional)"
                                    >
                                        <MenuItem value="A+">A+</MenuItem>
                                        <MenuItem value="A-">A-</MenuItem>
                                        <MenuItem value="B+">B+</MenuItem>
                                        <MenuItem value="B-">B-</MenuItem>
                                        <MenuItem value="AB+">AB+</MenuItem>
                                        <MenuItem value="AB-">AB-</MenuItem>
                                        <MenuItem value="O+">O+</MenuItem>
                                        <MenuItem value="O-">O-</MenuItem>
                                        <MenuItem value="nao_sei">Não sei</MenuItem>
                                    </Select>
                                )}
                            />
                        </FormControl>
                    </>
                ) : (
                    <>
                        <TextField
                            margin="normal"
                            fullWidth
                            id="specialty"
                            label="Especialidade"
                            error={!!errors.specialty}
                            helperText={errors.specialty?.message}
                            InputProps={{
                                sx: { borderRadius: 2 }
                            }}
                            sx={{ mb: { xs: 1.5, sm: 2 } }}
                            {...register('specialty')}
                        />

                        <TextField
                            margin="normal"
                            fullWidth
                            id="crm"
                            label="CRM/Registro Profissional"
                            error={!!errors.crm}
                            helperText={errors.crm?.message}
                            InputProps={{
                                sx: { borderRadius: 2 }
                            }}
                            sx={{ mb: { xs: 1.5, sm: 2 } }}
                            {...register('crm')}
                        />

                        <Alert
                            severity="info"
                            sx={{
                                mt: 2,
                                borderRadius: 2,
                                '& .MuiAlert-message': {
                                    fontSize: { xs: '0.85rem', sm: '0.95rem' }
                                }
                            }}
                        >
                            Nota: Profissionais de saúde precisam de aprovação do administrador para acessar o sistema. Após o cadastro, aguarde a confirmação por email.
                        </Alert>
                    </>
                );

            case 2:
                return (
                    <Box sx={{ textAlign: 'center', py: 2 }}>
                        <Avatar
                            sx={{
                                m: '0 auto',
                                bgcolor: 'success.main',
                                width: { xs: 60, sm: 80 },
                                height: { xs: 60, sm: 80 },
                                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                            }}
                        >
                            <PersonAdd fontSize="large" />
                        </Avatar>

                        <Typography variant="h5" sx={{ mt: 2, fontWeight: 600 }}>
                            Confirmar Cadastro
                        </Typography>

                        <Typography variant="body1" sx={{ mt: 1, mb: 3 }}>
                            Revise suas informações e clique em "Concluir Cadastro" para finalizar.
                        </Typography>

                        <Alert
                            severity="warning"
                            sx={{
                                mb: 3,
                                borderRadius: 2,
                                '& .MuiAlert-message': {
                                    fontSize: { xs: '0.85rem', sm: '0.95rem' }
                                }
                            }}
                        >
                            {watchUserType === 'profissional'
                                ? 'Lembre-se que seu cadastro como profissional precisará de aprovação do administrador.'
                                : 'Ao concluir o cadastro, você aceitará nossa política de privacidade e termos de uso.'}
                        </Alert>
                    </Box>
                );

            default:
                return null;
        }
    };

    return (
        <Container maxWidth={false} sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'background.default',
            backgroundImage: 'linear-gradient(135deg, #f5f7fa 0%, #e4efe9 100%)',
            px: { xs: 2, sm: 3 },
            py: { xs: 4, sm: 5 },
        }}>
            <Fade in={mounted} timeout={800}>
                <Paper
                    elevation={6}
                    sx={{
                        borderRadius: { xs: '12px', sm: '16px' },
                        overflow: 'hidden',
                        width: '100%',
                        maxWidth: { xs: '100%', sm: '550px' },
                        boxShadow: {
                            xs: '0 4px 12px rgba(0,0,0,0.1)',
                            sm: '0 10px 25px rgba(0,0,0,0.1)'
                        },
                    }}
                >
                    <Box sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        p: { xs: 2, sm: 3 },
                        textAlign: 'center',
                        backgroundImage: 'linear-gradient(135deg, #1976D2 0%, #2196F3 100%)',
                    }}>
                        <Avatar
                            sx={{
                                m: '0 auto',
                                bgcolor: 'white',
                                color: 'primary.main',
                                width: { xs: 50, sm: 60 },
                                height: { xs: 50, sm: 60 },
                                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                            }}
                        >
                            <PersonAdd fontSize={isMobile ? "medium" : "large"} />
                        </Avatar>
                        <Typography
                            component="h1"
                            variant={isMobile ? "h5" : "h4"}
                            sx={{
                                mt: 2,
                                fontWeight: 700
                            }}
                        >
                            Cadastre-se
                        </Typography>
                        <Typography variant="subtitle1" sx={{ mt: 1, opacity: 0.9, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                            VidaPlus - Sistema de Gestão Hospitalar
                        </Typography>
                    </Box>

                    <Box sx={{ p: { xs: 3, sm: 4 } }}>
                        {registerError && (
                            <Fade in={!!registerError}>
                                <Alert
                                    severity="error"
                                    sx={{
                                        mb: { xs: 2, sm: 3 },
                                        borderRadius: '8px',
                                        fontSize: { xs: '0.875rem', sm: '1rem' },
                                    }}
                                >
                                    {registerError}
                                </Alert>
                            </Fade>
                        )}

                        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>

                        <Box
                            component="form"
                            onSubmit={handleSubmit(handleRegister)}
                            sx={{ width: '100%' }}
                        >
                            {renderStepContent()}

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                                {activeStep > 0 ? (
                                    <Button
                                        variant="outlined"
                                        onClick={handleBackStep}
                                        sx={{
                                            borderRadius: 2,
                                            px: 3
                                        }}
                                    >
                                        Voltar
                                    </Button>
                                ) : (
                                    <Button
                                        variant="text"
                                        onClick={handleLoginClick}
                                        sx={{
                                            borderRadius: 2,
                                        }}
                                    >
                                        Já tem conta? Faça login
                                    </Button>
                                )}

                                {activeStep < steps.length - 1 ? (
                                    <Button
                                        variant="contained"
                                        onClick={handleNextStep}
                                        sx={{
                                            borderRadius: 2,
                                            px: 3,
                                            boxShadow: '0 4px 6px rgba(25, 118, 210, 0.25)',
                                        }}
                                    >
                                        Próximo
                                    </Button>
                                ) : (
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={loading}
                                        sx={{
                                            borderRadius: 2,
                                            px: 3,
                                            boxShadow: '0 4px 6px rgba(25, 118, 210, 0.25)',
                                            position: 'relative',
                                        }}
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
                                        ) : 'Concluir Cadastro'}
                                    </Button>
                                )}
                            </Box>

                            <Box sx={{ textAlign: 'center', mt: 3 }}>
                                <Link
                                    component="button"
                                    variant="body2"
                                    onClick={handlePrivacyPolicyClick}
                                    sx={{
                                        textDecoration: 'none',
                                        fontSize: { xs: '0.8rem', sm: '0.875rem' },
                                    }}
                                >
                                    Política de Privacidade
                                </Link>
                            </Box>
                        </Box>
                    </Box>
                </Paper>
            </Fade>

            {/* Modal de Consentimento */}
            <ConsentModal
                open={showConsentModal}
                onAccept={handleConsentAccept}
                onDecline={handleConsentDecline}
            />
        </Container>
    );
};

export default Register; 