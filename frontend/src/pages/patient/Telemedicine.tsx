import {
    AccessTime,
    EventAvailable,
    Info,
    Person,
    Search,
    Videocam
} from '@mui/icons-material';
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemText,
    Paper,
    Rating,
    Snackbar,
    Step,
    StepLabel,
    Stepper,
    Tab,
    Tabs,
    TextField,
    Typography
} from '@mui/material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/api';

interface Appointment {
    id: string;
    patientId: string;
    professionalId: string;
    date: string;
    status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
    type: 'consultation' | 'return' | 'telemedicine';
    professional?: {
        id: string;
        name: string;
        specialty: string;
        avatar?: string;
    };
}

// Interface para as próximas consultas
interface UpcomingAppointment {
    id: string;
    doctor: string;
    specialty: string;
    date: string;
    time: string;
    image?: string;
}

const PatientTelemedicine = () => {
    const { user } = useAuth();
    const [selectedTab, setSelectedTab] = useState(0);
    const [loading, setLoading] = useState(false);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [callTimeInterval, setCallTimeInterval] = useState<NodeJS.Timeout | null>(null);
    const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
    const [feedback, setFeedback] = useState({
        rating: 0,
        comment: ''
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error' | 'info' | 'warning'
    });

    // Dados mockados para as próximas consultas
    const upcomingAppointments: UpcomingAppointment[] = [
        {
            id: '1',
            doctor: 'Dr. Carlos Silva',
            specialty: 'Cardiologia',
            date: '15/05/2023',
            time: '14:30'
        }
    ];

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Inicializa a página
    useEffect(() => {
        if (user) {
            fetchTeleconsultations();
        }

        // Cleanup
        return () => {
            stopStreams();
            if (callTimeInterval) {
                clearInterval(callTimeInterval);
            }
        };
    }, [user]);

    // Scroll no chat quando há novas mensagens
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, []);

    // Atualizar vídeo local quando o stream muda
    useEffect(() => {
        if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream]);

    // Atualizar vídeo remoto quando o stream muda
    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    const fetchTeleconsultations = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/appointments?patientId=${user?.id}&type=telemedicine&_expand=professional`);
            // Filtrar apenas consultas futuras ou em andamento
            const activeTeleconsultations = response.data.filter((appointment: Appointment) =>
                appointment.status === 'scheduled' || appointment.status === 'in_progress'
            );
            setAppointments(activeTeleconsultations);
        } catch (error) {
            console.error('Erro ao buscar teleconsultas:', error);
            showSnackbar('Erro ao carregar suas teleconsultas', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleJoinCall = async (appointment: Appointment) => {
        setLoading(true);

        try {
            // Inicializa câmera e microfone
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });
            setLocalStream(stream);

            // Simula um stream remoto (em uma implementação real, isso viria da conexão WebRTC)
            const fakeRemoteStream = new MediaStream();
            // Normalmente, adicionaríamos faixas recebidas do peer remoto ao remoteStream
            setRemoteStream(fakeRemoteStream);

            // Inicia o timer de duração da chamada
            const interval = setInterval(() => {
                // A função setCallTime não é mais usada, apenas para manter a lógica do timer
            }, 1000);
            setCallTimeInterval(interval);

            // Atualiza o status da consulta para "em andamento"
            await api.patch(`/appointments/${appointment.id}`, {
                status: 'in_progress'
            });

        } catch (error) {
            console.error('Erro ao iniciar teleconsulta:', error);
            showSnackbar('Erro ao iniciar a teleconsulta. Verifique suas permissões de câmera e microfone.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const stopStreams = () => {
        // Para o stream de vídeo local
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
            setLocalStream(null);
        }

        // Limpa o stream de vídeo remoto
        setRemoteStream(null);
    };

    const handleSubmitFeedback = async () => {
        try {
            // Aqui seria feita uma chamada à API para salvar o feedback
            // await api.post('/teleconsultation-feedback', {
            //   appointmentId: selectedAppointment?.id,
            //   patientId: user?.id,
            //   professionalId: selectedAppointment?.professional?.id,
            //   rating: feedback.rating,
            //   comment: feedback.comment
            // });

            showSnackbar('Obrigado pelo seu feedback!', 'success');
            setShowFeedbackDialog(false);

            // Reseta o objeto de feedback
            setFeedback({
                rating: 0,
                comment: ''
            });

        } catch (error) {
            console.error('Erro ao enviar feedback:', error);
            showSnackbar('Erro ao enviar feedback, mas sua consulta foi finalizada com sucesso.', 'error');
        }
    };

    const getAppointmentStatusLabel = (status: string) => {
        switch (status) {
            case 'scheduled':
                return { label: 'Agendada', color: 'success' as const };
            case 'in_progress':
                return { label: 'Em Andamento', color: 'warning' as const };
            case 'completed':
                return { label: 'Concluída', color: 'info' as const };
            case 'cancelled':
                return { label: 'Cancelada', color: 'error' as const };
            default:
                return { label: status, color: 'default' as const };
        }
    };

    const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
        setSnackbar({
            open: true,
            message,
            severity
        });
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Telemedicina
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Agende e participe de consultas médicas online.
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Paper elevation={2} sx={{ p: 0 }}>
                        <Tabs
                            value={selectedTab}
                            onChange={(event, newValue) => {
                                setSelectedTab(newValue);
                            }}
                            variant="fullWidth"
                        >
                            <Tab icon={<Videocam />} label="MINHAS CONSULTAS" />
                            <Tab icon={<EventAvailable />} label="AGENDAR" />
                            <Tab icon={<Info />} label="COMO FUNCIONA" />
                        </Tabs>

                        <Box sx={{ p: 3 }}>
                            {selectedTab === 0 && (
                                <>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                        <Typography variant="h6">
                                            Próximas Consultas
                                        </Typography>
                                    </Box>

                                    {loading ? (
                                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                            <CircularProgress />
                                        </Box>
                                    ) : appointments.length > 0 ? (
                                        <Grid container spacing={3}>
                                            {appointments.map(appointment => {
                                                const appointmentDate = new Date(appointment.date);
                                                const isToday = new Date().toDateString() === appointmentDate.toDateString();
                                                const statusInfo = getAppointmentStatusLabel(appointment.status);

                                                return (
                                                    <Grid item xs={12} sm={6} md={4} key={appointment.id}>
                                                        <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                                            <CardContent sx={{ flexGrow: 1 }}>
                                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                                    <Chip
                                                                        label={statusInfo.label}
                                                                        color={statusInfo.color}
                                                                        size="small"
                                                                    />
                                                                    {isToday && appointment.status === 'scheduled' && (
                                                                        <Chip
                                                                            label="Hoje"
                                                                            color="primary"
                                                                            size="small"
                                                                        />
                                                                    )}
                                                                </Box>
                                                                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                                                                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                                                                        {appointment.professional?.avatar ? (
                                                                            <img src={appointment.professional.avatar} alt={appointment.professional.name} />
                                                                        ) : (
                                                                            <Person />
                                                                        )}
                                                                    </Avatar>
                                                                    <Box>
                                                                        <Typography variant="h6" gutterBottom>
                                                                            {appointment.professional?.name || 'Profissional de Saúde'}
                                                                        </Typography>
                                                                        <Typography variant="body2" color="text.secondary">
                                                                            {appointment.professional?.specialty || 'Especialidade não informada'}
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                                <Divider sx={{ my: 2 }} />
                                                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                    <AccessTime fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                                                                    {format(appointmentDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                                                                </Typography>
                                                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                                                                    <AccessTime fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                                                                    {format(appointmentDate, 'HH:mm', { locale: ptBR })}
                                                                </Typography>
                                                            </CardContent>
                                                            <Divider />
                                                            <Box sx={{ p: 2 }}>
                                                                <Button
                                                                    variant="contained"
                                                                    color="primary"
                                                                    fullWidth
                                                                    startIcon={<Videocam />}
                                                                    onClick={() => handleJoinCall(appointment)}
                                                                    disabled={appointment.status !== 'scheduled' || loading}
                                                                >
                                                                    {appointment.status === 'scheduled' ? 'Entrar na Teleconsulta' : 'Teleconsulta Finalizada'}
                                                                </Button>
                                                            </Box>
                                                        </Card>
                                                    </Grid>
                                                );
                                            })}
                                        </Grid>
                                    ) : (
                                        <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
                                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                                Você não possui teleconsultas agendadas.
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" paragraph>
                                                Para agendar uma teleconsulta, vá para a seção "Consultas" e selecione a opção "Teleconsulta".
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => {
                                                    // Navegar para a página de agendamento
                                                    window.location.href = '/patient/appointments';
                                                }}
                                            >
                                                Agendar Teleconsulta
                                            </Button>
                                        </Paper>
                                    )}
                                </>
                            )}

                            {selectedTab === 1 && (
                                <Box>
                                    <Typography variant="h6" gutterBottom>
                                        Agendar Nova Teleconsulta
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                        Siga os passos para agendar uma nova consulta médica online.
                                    </Typography>

                                    <Stepper activeStep={0} sx={{ mb: 4 }}>
                                        {['Selecionar especialidade', 'Escolher profissional', 'Agendar data/hora', 'Confirmar'].map((label) => (
                                            <Step key={label}>
                                                <StepLabel>{label}</StepLabel>
                                            </Step>
                                        ))}
                                    </Stepper>

                                    <Box>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            label="Pesquisar especialidade"
                                            placeholder="Ex: Cardiologia, Ortopedia..."
                                            InputProps={{
                                                startAdornment: <Search color="action" sx={{ mr: 1 }} />,
                                            }}
                                            sx={{ mb: 3 }}
                                        />

                                        <Grid container spacing={2}>
                                            {[
                                                { id: 1, name: 'Cardiologia' },
                                                { id: 2, name: 'Dermatologia' },
                                                { id: 3, name: 'Ortopedia' },
                                                { id: 4, name: 'Clínico Geral' },
                                                { id: 5, name: 'Pediatria' },
                                                { id: 6, name: 'Psiquiatria' }
                                            ].map((specialty) => (
                                                <Grid item xs={12} sm={6} key={specialty.id}>
                                                    <Card
                                                        variant="outlined"
                                                        sx={{
                                                            p: 2,
                                                            cursor: 'pointer',
                                                            '&:hover': {
                                                                bgcolor: 'primary.light',
                                                                color: 'white'
                                                            }
                                                        }}
                                                    >
                                                        <Typography variant="h6">{specialty.name}</Typography>
                                                    </Card>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Box>
                                </Box>
                            )}

                            {selectedTab === 2 && (
                                <Box>
                                    <Typography variant="h6" gutterBottom>
                                        Como funciona a Telemedicina
                                    </Typography>
                                    <Typography variant="body2" paragraph>
                                        A telemedicina permite consultas médicas online, sem precisar sair de casa, garantindo
                                        atendimento de qualidade e segurança.
                                    </Typography>

                                    <Stepper orientation="vertical" sx={{ mt: 3 }}>
                                        <Step active={true}>
                                            <StepLabel>
                                                <Typography variant="subtitle1">Agende sua consulta</Typography>
                                            </StepLabel>
                                            <Box sx={{ ml: 3, mt: 1, mb: 2 }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Escolha a especialidade, o médico e o melhor horário para você.
                                                    Faça o pagamento e receba a confirmação por e-mail.
                                                </Typography>
                                            </Box>
                                        </Step>
                                        <Step active={true}>
                                            <StepLabel>
                                                <Typography variant="subtitle1">Prepare-se para a consulta</Typography>
                                            </StepLabel>
                                            <Box sx={{ ml: 3, mt: 1, mb: 2 }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Verifique se sua câmera e microfone estão funcionando.
                                                    Separe seus exames e receitas anteriores para mostrar ao médico se necessário.
                                                    Prepare suas dúvidas e sintomas para relatar.
                                                </Typography>
                                            </Box>
                                        </Step>
                                        <Step active={true}>
                                            <StepLabel>
                                                <Typography variant="subtitle1">Durante a consulta</Typography>
                                            </StepLabel>
                                            <Box sx={{ ml: 3, mt: 1, mb: 2 }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Entre na sala virtual 5 minutos antes do horário agendado.
                                                    O médico fará a anamnese, exame visual e dará orientações.
                                                    A consulta terá duração média de 15 a 30 minutos.
                                                </Typography>
                                            </Box>
                                        </Step>
                                        <Step active={true}>
                                            <StepLabel>
                                                <Typography variant="subtitle1">Após a consulta</Typography>
                                            </StepLabel>
                                            <Box sx={{ ml: 3, mt: 1, mb: 2 }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Receberá a receita, atestado ou pedido de exames por e-mail.
                                                    Poderá acessar o resumo da consulta em seu histórico.
                                                    Se necessário, o médico poderá solicitar uma consulta presencial.
                                                </Typography>
                                            </Box>
                                        </Step>
                                    </Stepper>
                                </Box>
                            )}
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Próxima Consulta
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                <CircularProgress />
                            </Box>
                        ) : upcomingAppointments.length > 0 ? (
                            <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Avatar
                                        src={upcomingAppointments[0].image}
                                        alt={upcomingAppointments[0].doctor}
                                        sx={{ width: 48, height: 48, mr: 2 }}
                                    />
                                    <Box>
                                        <Typography variant="subtitle1">
                                            {upcomingAppointments[0].doctor}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {upcomingAppointments[0].specialty}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <AccessTime fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                                    <Typography variant="body2">
                                        {upcomingAppointments[0].date}
                                    </Typography>
                                    <AccessTime fontSize="small" sx={{ ml: 2, mr: 1, color: 'primary.main' }} />
                                    <Typography variant="body2">
                                        {upcomingAppointments[0].time}
                                    </Typography>
                                </Box>

                                <Button
                                    variant="contained"
                                    startIcon={<Videocam />}
                                    fullWidth
                                    sx={{ mb: 1 }}
                                >
                                    Entrar na Sala
                                </Button>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                >
                                    Reagendar
                                </Button>
                            </Box>
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 2 }}>
                                <Typography variant="body1" color="text.secondary">
                                    Nenhuma consulta agendada
                                </Typography>
                                <Button
                                    variant="contained"
                                    sx={{ mt: 2 }}
                                    onClick={() => setSelectedTab(1)}
                                >
                                    Agendar Agora
                                </Button>
                            </Box>
                        )}
                    </Paper>

                    <Paper elevation={2} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Dicas para Teleconsulta
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        <List>
                            <ListItem sx={{ px: 0 }}>
                                <ListItemText
                                    primary="Verifique sua conexão"
                                    secondary="Certifique-se de ter uma conexão estável de internet."
                                />
                            </ListItem>
                            <ListItem sx={{ px: 0 }}>
                                <ListItemText
                                    primary="Ambiente adequado"
                                    secondary="Escolha um local calmo, bem iluminado e privado."
                                />
                            </ListItem>
                            <ListItem sx={{ px: 0 }}>
                                <ListItemText
                                    primary="Prepare seus documentos"
                                    secondary="Tenha em mãos receitas, exames e histórico médico."
                                />
                            </ListItem>
                            <ListItem sx={{ px: 0 }}>
                                <ListItemText
                                    primary="Teste o equipamento"
                                    secondary="Verifique se câmera e microfone estão funcionando."
                                />
                            </ListItem>
                        </List>

                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={() => setSelectedTab(2)}
                            sx={{ mt: 2 }}
                        >
                            Saiba Mais
                        </Button>
                    </Paper>
                </Grid>
            </Grid>

            {/* Modal de feedback da consulta */}
            <Dialog
                open={showFeedbackDialog}
                onClose={() => setShowFeedbackDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    Avalie sua Teleconsulta
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, my: 1 }}>
                        <Typography variant="body1">
                            Obrigado por participar da teleconsulta. Sua avaliação é muito importante para melhorarmos nosso serviço.
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Typography variant="subtitle1" gutterBottom>
                                Como você avalia o atendimento?
                            </Typography>
                            <Rating
                                name="consultation-rating"
                                value={feedback.rating}
                                onChange={(event: React.SyntheticEvent, newValue: number | null) => {
                                    setFeedback(prev => ({ ...prev, rating: newValue || 0 }));
                                }}
                                size="large"
                                sx={{ fontSize: '2.5rem', mb: 2 }}
                            />
                        </Box>

                        <TextField
                            label="Comentários e sugestões (opcional)"
                            multiline
                            rows={4}
                            fullWidth
                            value={feedback.comment}
                            onChange={(e) => setFeedback(prev => ({ ...prev, comment: e.target.value }))}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowFeedbackDialog(false)} color="inherit">
                        Pular
                    </Button>
                    <Button onClick={handleSubmitFeedback} variant="contained" color="primary">
                        Enviar Avaliação
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar para mensagens */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={5000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                    variant="filled"
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default PatientTelemedicine; 