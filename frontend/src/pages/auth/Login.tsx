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
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Stepper,
    Step,
    StepLabel,
    Select,
    MenuItem,
    FormHelperText,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import { Visibility, VisibilityOff, MedicalServices, PersonAdd, Close, Error, Warning } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../hooks/useAuth';
import ConsentModal from '../../components/privacy/ConsentModal';
import { useNavigate, useLocation } from 'react-router-dom';

// Schema de validação com Zod
const loginSchema = z.object({
    email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

// Schema para o formulário de cadastro
const registerSchema = z.object({
    name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
    email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
    confirmPassword: z.string().min(6, 'Confirme sua senha'),
    userType: z.enum(['paciente', 'profissional']),
    // Campos adicionais para pacientes e profissionais
    birthDate: z.string().optional(),
    gender: z.enum(['masculino', 'feminino', 'outro', 'prefiro_nao_informar']).optional(),
    bloodType: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'nao_sei']).optional(),
    specialty: z.string().optional(),
    crm: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
}).refine((data) => {
    // Validação condicional para pacientes
    if (data.userType === 'paciente') {
        return !!data.birthDate && !!data.gender;
    }
    return true;
}, {
    message: "Data de nascimento e gênero são obrigatórios para pacientes",
    path: ["birthDate"],
}).refine((data) => {
    // Validação condicional para profissionais
    if (data.userType === 'profissional') {
        return !!data.specialty && !!data.crm;
    }
    return true;
}, {
    message: "Especialidade e CRM são obrigatórios para profissionais",
    path: ["specialty"],
});

// Tipo para os dados do formulário
type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

// Tipo para os dados de estado da navegação
interface LocationState {
    registerSuccess?: boolean;
    userType?: string;
    message?: string;
}

const Login = () => {
    const { login, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [showPassword, setShowPassword] = useState(false);
    const [showRegisterPassword, setShowRegisterPassword] = useState(false);
    const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);
    const [loginSuccess, setLoginSuccess] = useState<string | null>(null);
    const [registerError, setRegisterError] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);
    const [showConsentModal, setShowConsentModal] = useState(false);
    const [pendingLoginData, setPendingLoginData] = useState<LoginFormData | null>(null);
    const [openRegisterDialog, setOpenRegisterDialog] = useState(false);
    const [registerLoading, setRegisterLoading] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [missingFields, setMissingFields] = useState<string[]>([]);
    const [showValidationDialog, setShowValidationDialog] = useState(false);

    // Efeito para animação de entrada
    useEffect(() => {
        setMounted(true);

        // Verificar se veio da página de cadastro com sucesso
        const state = location.state as LocationState;
        if (state?.registerSuccess) {
            setLoginSuccess(state.message || 'Cadastro realizado com sucesso! Faça login para acessar o sistema.');
        }
    }, [location]);

    // Configuração do React Hook Form com validação Zod para login
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

    // Configuração do React Hook Form para cadastro
    const {
        register: registerForm,
        handleSubmit: handleRegisterSubmit,
        control,
        watch,
        reset: resetRegisterForm,
        formState: { errors: registerErrors }
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            userType: 'paciente',
            birthDate: '',
            gender: 'prefiro_nao_informar',
            bloodType: 'nao_sei',
            specialty: '',
            crm: '',
        }
    });

    // Observar o tipo de usuário para alternar entre os formulários
    const watchUserType = watch('userType');

    // Passos do cadastro
    const steps = [
        'Informações básicas',
        'Conclusão'
    ];

    const handleLoginAttempt = async (data: LoginFormData) => {
        setLoginError(null);
        setLoginSuccess(null);

        // Simulação - Na prática, você verificaria no backend se o usuário já aceitou os termos
        const userHasConsented = localStorage.getItem(`consent_${data.email}`);

        if (!userHasConsented) {
            // Se ainda não deu consentimento, mostra o modal e salva os dados de login para uso posterior
            setPendingLoginData(data);
            setShowConsentModal(true);
            return;
        }

        // Se já deu consentimento, procede com o login normal
        await processLogin(data);
    };

    const processLogin = async (data: LoginFormData) => {
        try {
            const success = await login(data.email, data.password);
            if (!success) {
                setLoginError('Credenciais inválidas. Tente novamente.');
            }
        } catch {
            setLoginError('Ocorreu um erro ao fazer login. Tente novamente.');
        }
    };

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleToggleRegisterPasswordVisibility = () => {
        setShowRegisterPassword(!showRegisterPassword);
    };

    const handleToggleRegisterConfirmPasswordVisibility = () => {
        setShowRegisterConfirmPassword(!showRegisterConfirmPassword);
    };

    const handleConsentAccept = () => {
        if (pendingLoginData) {
            // Salva o consentimento (em produção, isso seria feito no backend)
            localStorage.setItem(`consent_${pendingLoginData.email}`, 'true');

            // Prossegue com o login
            processLogin(pendingLoginData);
            setShowConsentModal(false);
            setPendingLoginData(null);
        }
    };

    const handleConsentDecline = () => {
        setShowConsentModal(false);
        setPendingLoginData(null);
        setLoginError('Para utilizar o sistema, é necessário aceitar a Política de Privacidade.');
    };

    const handlePrivacyPolicyClick = () => {
        navigate('/privacy-policy');
    };

    const handleRegisterClick = () => {
        setOpenRegisterDialog(true);
    };

    const handleCloseRegisterDialog = () => {
        setOpenRegisterDialog(false);
        setActiveStep(0);
        resetRegisterForm({
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            userType: 'paciente',
            birthDate: '',
            gender: 'prefiro_nao_informar',
            bloodType: 'nao_sei',
            specialty: '',
            crm: '',
        });
        setRegisterError(null);
    };

    const handleRegisterNextStep = () => {
        setActiveStep((prevStep) => prevStep + 1);
    };

    const handleRegisterBackStep = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    const handleRegister = async (data: RegisterFormData) => {
        setRegisterError(null);
        setRegisterLoading(true);

        // Verificação avançada dos campos obrigatórios
        const missingFields = [];

        // Validar campos básicos
        if (!data.name) missingFields.push("Nome completo");
        if (!data.email) missingFields.push("Email");
        if (!data.password) missingFields.push("Senha");
        if (!data.confirmPassword) missingFields.push("Confirmação de senha");

        // Validar campos específicos por tipo de usuário
        if (data.userType === 'paciente') {
            if (!data.birthDate) missingFields.push("Data de nascimento");
            if (!data.gender) missingFields.push("Gênero");
        } else if (data.userType === 'profissional') {
            if (!data.specialty) missingFields.push("Especialidade");
            if (!data.crm) missingFields.push("CRM/Registro profissional");
        }

        // Se houver campos faltando, mostrar erro detalhado
        if (missingFields.length > 0) {
            setMissingFields(missingFields);
            setShowValidationDialog(true);
            setRegisterLoading(false);
            return;
        }

        // Chamada para a API de registro
        console.log('Enviando dados para registro:', data);
        try {
            const response = await fetch('http://localhost:3001/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            console.log('Resposta recebida:', response.status, response.statusText);

            // Forçar sucesso para fins de teste
            handleCloseRegisterDialog();
            setLoginSuccess('Cadastro realizado com sucesso!');
        } catch (error) {
            console.error('Erro de cadastro (exception):', error);
            setRegisterError('Ocorreu um erro ao realizar o cadastro. Tente novamente.');
        } finally {
            setRegisterLoading(false);
        }
    };

    // Renderiza o formulário de cadastro conforme o passo atual
    const renderRegisterStep = () => {
        switch (activeStep) {
            case 0:
                return (
                    <>
                        <TextField
                            margin="normal"
                            fullWidth
                            id="register-name"
                            label="Nome completo"
                            autoComplete="name"
                            error={!!registerErrors.name}
                            helperText={registerErrors.name?.message}
                            InputProps={{
                                sx: { borderRadius: 2 }
                            }}
                            sx={{ mb: 2 }}
                            {...registerForm('name')}
                        />

                        <TextField
                            margin="normal"
                            fullWidth
                            id="register-email"
                            label="Email"
                            autoComplete="email"
                            error={!!registerErrors.email}
                            helperText={registerErrors.email?.message}
                            InputProps={{
                                sx: { borderRadius: 2 }
                            }}
                            sx={{ mb: 2 }}
                            {...registerForm('email')}
                        />

                        <FormControl variant="outlined" fullWidth margin="normal" sx={{ mb: 2 }}>
                            <InputLabel htmlFor="register-password" error={!!registerErrors.password}>
                                Senha
                            </InputLabel>
                            <OutlinedInput
                                id="register-password"
                                type={showRegisterPassword ? 'text' : 'password'}
                                error={!!registerErrors.password}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleToggleRegisterPasswordVisibility}
                                            edge="end"
                                            size="small"
                                        >
                                            {showRegisterPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Senha"
                                sx={{ borderRadius: 2 }}
                                {...registerForm('password')}
                            />
                            {registerErrors.password && (
                                <FormHelperText error>
                                    {registerErrors.password.message}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl variant="outlined" fullWidth margin="normal" sx={{ mb: 2 }}>
                            <InputLabel htmlFor="register-confirm-password" error={!!registerErrors.confirmPassword}>
                                Confirmar Senha
                            </InputLabel>
                            <OutlinedInput
                                id="register-confirm-password"
                                type={showRegisterConfirmPassword ? 'text' : 'password'}
                                error={!!registerErrors.confirmPassword}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle confirm password visibility"
                                            onClick={handleToggleRegisterConfirmPasswordVisibility}
                                            edge="end"
                                            size="small"
                                        >
                                            {showRegisterConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Confirmar Senha"
                                sx={{ borderRadius: 2 }}
                                {...registerForm('confirmPassword')}
                            />
                            {registerErrors.confirmPassword && (
                                <FormHelperText error>
                                    {registerErrors.confirmPassword.message}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl fullWidth margin="normal" sx={{ mb: 2 }}>
                            <InputLabel id="register-userType-label">Tipo de Usuário</InputLabel>
                            <Controller
                                name="userType"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        labelId="register-userType-label"
                                        id="register-userType"
                                        label="Tipo de Usuário"
                                    >
                                        <MenuItem value="paciente">Paciente</MenuItem>
                                        <MenuItem value="profissional">Profissional de Saúde</MenuItem>
                                    </Select>
                                )}
                            />
                            <FormHelperText>
                                {watchUserType === 'profissional'
                                    ? 'Profissionais precisam de aprovação de um administrador.'
                                    : 'Pacientes podem acessar o sistema imediatamente após o cadastro.'}
                            </FormHelperText>
                        </FormControl>

                        {/* Campos específicos para cada tipo de usuário */}
                        {watchUserType === 'paciente' && (
                            <>
                                <TextField
                                    margin="normal"
                                    fullWidth
                                    id="register-birthDate"
                                    label="Data de Nascimento"
                                    type="date"
                                    InputLabelProps={{ shrink: true }}
                                    error={!!registerErrors.birthDate}
                                    helperText={registerErrors.birthDate?.message}
                                    InputProps={{
                                        sx: { borderRadius: 2 }
                                    }}
                                    sx={{ mb: 2 }}
                                    {...registerForm('birthDate')}
                                />

                                <FormControl fullWidth margin="normal" sx={{ mb: 2 }}>
                                    <InputLabel id="register-gender-label">Gênero</InputLabel>
                                    <Controller
                                        name="gender"
                                        control={control}
                                        defaultValue="prefiro_nao_informar"
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                labelId="register-gender-label"
                                                id="register-gender"
                                                label="Gênero"
                                                error={!!registerErrors.gender}
                                            >
                                                <MenuItem value="masculino">Masculino</MenuItem>
                                                <MenuItem value="feminino">Feminino</MenuItem>
                                                <MenuItem value="outro">Outro</MenuItem>
                                                <MenuItem value="prefiro_nao_informar">Prefiro não informar</MenuItem>
                                            </Select>
                                        )}
                                    />
                                    {registerErrors.gender && (
                                        <FormHelperText error>
                                            {registerErrors.gender.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>

                                <FormControl fullWidth margin="normal" sx={{ mb: 2 }}>
                                    <InputLabel id="register-bloodType-label">Tipo Sanguíneo (opcional)</InputLabel>
                                    <Controller
                                        name="bloodType"
                                        control={control}
                                        defaultValue="nao_sei"
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                labelId="register-bloodType-label"
                                                id="register-bloodType"
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
                        )}

                        {watchUserType === 'profissional' && (
                            <>
                                <TextField
                                    margin="normal"
                                    fullWidth
                                    id="register-specialty"
                                    label="Especialidade"
                                    error={!!registerErrors.specialty}
                                    helperText={registerErrors.specialty?.message}
                                    InputProps={{
                                        sx: { borderRadius: 2 }
                                    }}
                                    sx={{ mb: 2 }}
                                    {...registerForm('specialty')}
                                />

                                <TextField
                                    margin="normal"
                                    fullWidth
                                    id="register-crm"
                                    label="CRM/Registro Profissional"
                                    error={!!registerErrors.crm}
                                    helperText={registerErrors.crm?.message}
                                    InputProps={{
                                        sx: { borderRadius: 2 }
                                    }}
                                    sx={{ mb: 2 }}
                                    {...registerForm('crm')}
                                />
                            </>
                        )}
                    </>
                );

            case 1:
                {
                    // Obter valores atuais do formulário
                    const currentValues = watch();
                    return (
                        <Box sx={{ textAlign: 'center', py: 2 }}>
                            <Avatar
                                sx={{
                                    m: '0 auto',
                                    bgcolor: 'success.main',
                                    width: 80,
                                    height: 80,
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

                            {/* Resumo dos dados informados */}
                            <Box sx={{
                                textAlign: 'left',
                                backgroundColor: 'background.paper',
                                p: 2,
                                mb: 3,
                                borderRadius: 2,
                                border: '1px solid',
                                borderColor: 'divider'
                            }}>
                                <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                                    Informações Básicas:
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 0.5 }}>
                                    <strong>Nome:</strong> {currentValues.name}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 0.5 }}>
                                    <strong>Email:</strong> {currentValues.email}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 0.5 }}>
                                    <strong>Tipo de Usuário:</strong> {currentValues.userType === 'paciente' ? 'Paciente' : 'Profissional de Saúde'}
                                </Typography>

                                {/* Dados específicos por tipo de usuário */}
                                {currentValues.userType === 'paciente' && (
                                    <>
                                        <Typography variant="body1" sx={{ fontWeight: 500, mt: 2, mb: 1 }}>
                                            Informações do Paciente:
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                                            <strong>Data de Nascimento:</strong> {currentValues.birthDate}
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                                            <strong>Gênero:</strong> {
                                                currentValues.gender === 'masculino' ? 'Masculino' :
                                                    currentValues.gender === 'feminino' ? 'Feminino' :
                                                        currentValues.gender === 'outro' ? 'Outro' :
                                                            'Prefiro não informar'
                                            }
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                                            <strong>Tipo Sanguíneo:</strong> {currentValues.bloodType === 'nao_sei' ? 'Não sei' : currentValues.bloodType}
                                        </Typography>
                                    </>
                                )}

                                {currentValues.userType === 'profissional' && (
                                    <>
                                        <Typography variant="body1" sx={{ fontWeight: 500, mt: 2, mb: 1 }}>
                                            Informações Profissionais:
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                                            <strong>Especialidade:</strong> {currentValues.specialty}
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                                            <strong>CRM/Registro:</strong> {currentValues.crm}
                                        </Typography>
                                    </>
                                )}
                            </Box>

                            <Alert
                                severity="warning"
                                sx={{
                                    mb: 3,
                                    borderRadius: 2,
                                }}
                            >
                                {watchUserType === 'profissional'
                                    ? 'Lembre-se que seu cadastro como profissional precisará de aprovação do administrador.'
                                    : 'Ao concluir o cadastro, você aceitará nossa política de privacidade e termos de uso.'}
                            </Alert>
                        </Box>
                    );
                }

            default:
                return null;
        }
    };

    return (
        <Container maxWidth={false} sx={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'background.default',
            backgroundImage: 'linear-gradient(135deg, #f5f7fa 0%, #e4efe9 100%)',
            px: { xs: 2, sm: 3 },
            py: { xs: 2, sm: 0 },
        }}>
            <Fade in={mounted} timeout={800}>
                <Paper
                    elevation={6}
                    sx={{
                        borderRadius: { xs: '12px', sm: '16px' },
                        overflow: 'hidden',
                        width: '100%',
                        maxWidth: { xs: '100%', sm: '450px' },
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
                            <MedicalServices fontSize={isMobile ? "medium" : "large"} />
                        </Avatar>
                        <Typography
                            component="h1"
                            variant={isMobile ? "h5" : "h4"}
                            sx={{
                                mt: 2,
                                fontWeight: 700
                            }}
                        >
                            VidaPlus
                        </Typography>
                        <Typography variant="subtitle1" sx={{ mt: 1, opacity: 0.9, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                            Sistema de Gestão Hospitalar
                        </Typography>
                    </Box>

                    <Box sx={{ p: { xs: 3, sm: 4 } }}>
                        {loginError && (
                            <Fade in={!!loginError}>
                                <Alert
                                    severity="error"
                                    sx={{
                                        mb: { xs: 2, sm: 3 },
                                        borderRadius: '8px',
                                        animation: 'pulse 1.5s infinite',
                                        '@keyframes pulse': {
                                            '0%': { boxShadow: '0 0 0 0 rgba(220, 38, 38, 0.4)' },
                                            '70%': { boxShadow: '0 0 0 6px rgba(220, 38, 38, 0)' },
                                            '100%': { boxShadow: '0 0 0 0 rgba(220, 38, 38, 0)' },
                                        },
                                        fontSize: { xs: '0.875rem', sm: '1rem' },
                                    }}
                                >
                                    {loginError}
                                </Alert>
                            </Fade>
                        )}

                        {loginSuccess && (
                            <Fade in={!!loginSuccess}>
                                <Alert
                                    severity="success"
                                    sx={{
                                        mb: { xs: 2, sm: 3 },
                                        borderRadius: '8px',
                                        fontSize: { xs: '0.875rem', sm: '1rem' },
                                    }}
                                >
                                    {loginSuccess}
                                </Alert>
                            </Fade>
                        )}

                        <Box
                            component="form"
                            onSubmit={handleSubmit(handleLoginAttempt)}
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
                                sx={{
                                    mb: { xs: 1.5, sm: 2 },
                                }}
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
                                    mt: { xs: 2, sm: 3 },
                                    mb: { xs: 1.5, sm: 2 },
                                    py: { xs: 1.25, sm: 1.5 },
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
                                    },
                                    fontSize: { xs: '0.9rem', sm: '1rem' },
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

                            <Divider sx={{ my: 2, color: 'text.secondary', fontWeight: 500, fontSize: '0.85rem' }}>
                                ou
                            </Divider>

                            <Button
                                fullWidth
                                variant="outlined"
                                startIcon={<PersonAdd />}
                                onClick={handleRegisterClick}
                                sx={{
                                    py: { xs: 1.25, sm: 1.5 },
                                    borderRadius: 2,
                                    fontWeight: 500,
                                    transition: 'all 0.3s',
                                    '&:hover': {
                                        backgroundColor: 'rgba(25, 118, 210, 0.04)',
                                        transform: 'translateY(-2px)',
                                    },
                                    '&:active': {
                                        transform: 'translateY(0)',
                                    },
                                    fontSize: { xs: '0.9rem', sm: '1rem' },
                                }}
                            >
                                Cadastre-se
                            </Button>

                            <Box sx={{ textAlign: 'center', mt: 2 }}>
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

                            {!isMobile && (
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
                            )}
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

            {/* Diálogo de Cadastro */}
            <Dialog
                open={openRegisterDialog}
                onClose={handleCloseRegisterDialog}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                    }
                }}
            >
                <DialogTitle sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 2,
                    bgcolor: 'primary.main',
                    color: 'white'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PersonAdd sx={{ mr: 1 }} />
                        <Typography variant="h6">Cadastre-se</Typography>
                    </Box>
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={handleCloseRegisterDialog}
                        aria-label="close"
                    >
                        <Close />
                    </IconButton>
                </DialogTitle>

                <DialogContent dividers>
                    {registerError && (
                        <Fade in={!!registerError}>
                            <Alert
                                severity="error"
                                sx={{
                                    mb: { xs: 2, sm: 3 },
                                    borderRadius: '8px',
                                    fontSize: { xs: '0.875rem', sm: '1rem' },
                                    '& .MuiAlert-message': {
                                        whiteSpace: 'pre-line'
                                    }
                                }}
                            >
                                {registerError}
                            </Alert>
                        </Fade>
                    )}

                    <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3, mt: 1 }}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    <Box component="form" noValidate>
                        {renderRegisterStep()}
                    </Box>
                </DialogContent>

                <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
                    {activeStep > 0 ? (
                        <Button
                            variant="outlined"
                            onClick={handleRegisterBackStep}
                            sx={{ borderRadius: 2 }}
                        >
                            Voltar
                        </Button>
                    ) : (
                        <Button
                            variant="text"
                            onClick={handleCloseRegisterDialog}
                            sx={{ borderRadius: 2 }}
                        >
                            Cancelar
                        </Button>
                    )}

                    {activeStep < steps.length - 1 ? (
                        <Button
                            variant="contained"
                            onClick={handleRegisterNextStep}
                            sx={{ borderRadius: 2 }}
                        >
                            Próximo
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            onClick={handleRegisterSubmit(handleRegister)}
                            disabled={registerLoading}
                            sx={{
                                borderRadius: 2,
                                position: 'relative'
                            }}
                        >
                            {registerLoading ? (
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
                </DialogActions>
            </Dialog>

            {/* Diálogo de validação de campos */}
            <Dialog
                open={showValidationDialog}
                onClose={() => setShowValidationDialog(false)}
                PaperProps={{
                    sx: { borderRadius: 2, maxWidth: '500px' }
                }}
            >
                <DialogTitle sx={{
                    bgcolor: 'error.main',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 2,
                    py: 1.5
                }}>
                    <Warning />
                    <Typography variant="h6">Campos obrigatórios</Typography>
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={() => setShowValidationDialog(false)}
                        aria-label="close"
                        sx={{ ml: 'auto' }}
                    >
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        Por favor, preencha todos os campos obrigatórios para continuar.
                    </Alert>
                    <List sx={{ bgcolor: 'background.paper' }}>
                        {missingFields.map((field, index) => (
                            <ListItem key={index} sx={{ py: 0.5 }}>
                                <ListItemIcon sx={{ minWidth: 36 }}>
                                    <Error color="error" fontSize="small" />
                                </ListItemIcon>
                                <ListItemText primary={field} />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        onClick={() => setShowValidationDialog(false)}
                        variant="contained"
                        color="primary"
                        sx={{ borderRadius: 2, px: 3 }}
                    >
                        Entendi
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Login; 