import {
    AccessTime,
    Add as AddIcon,
    ArrowForward,
    Cancel as CancelIcon,
    CheckCircle,
    Check as CheckIcon,
    Close as CloseIcon,
    EventAvailable,
    FileCopy,
    History,
    Message,
    PeopleAlt,
    PersonAdd,
    Room,
    Send,
    Settings,
    SignalWifi4Bar,
    SignalWifiOff,
    Today,
    VideoCall,
    Videocam,
    Warning
} from '@mui/icons-material';
import {
    Avatar,
    Badge,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    InputLabel,
    List,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
    MenuItem,
    Paper,
    Select,
    Switch,
    Tab,
    Tabs,
    TextField,
    Typography
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useNavigate } from 'react-router-dom';

interface TeleconsultationAppointment {
    id: number;
    patientId: number;
    patientName: string;
    patientAvatar?: string;
    date: string;
    time: string;
    duration: number; // em minutos
    status: 'scheduled' | 'completed' | 'cancelled' | 'in-progress';
    reason?: string;
    notes?: string;
}

const ProfessionalTelemedicine = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isExtraSmall = useMediaQuery('(max-width:400px)');
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
    const [selectedTab, setSelectedTab] = useState(0);
    const [openConsultation, setOpenConsultation] = useState<TeleconsultationAppointment | null>(null);
    const [openSettings, setOpenSettings] = useState(false);

    // Estado para formulário de sala
    const [roomName, setRoomName] = useState('Consulta Dr. Silva');
    const [maxDuration, setMaxDuration] = useState('30');
    const [isAvailable, setIsAvailable] = useState(true);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue);
    };

    // Dados mockados de consultas agendadas para hoje
    const todaysConsultations = [
        {
            id: 1,
            patient: 'Maria Oliveira',
            age: 42,
            image: 'https://xsgames.co/randomusers/assets/avatars/female/5.jpg',
            time: '14:30',
            type: 'Retorno',
            status: 'Confirmada',
            online: true
        },
        {
            id: 2,
            patient: 'João Santos',
            age: 65,
            image: 'https://xsgames.co/randomusers/assets/avatars/male/6.jpg',
            time: '15:00',
            type: 'Primeira consulta',
            status: 'Pendente',
            online: false
        },
        {
            id: 3,
            patient: 'Ana Ferreira',
            age: 29,
            image: 'https://xsgames.co/randomusers/assets/avatars/female/7.jpg',
            time: '16:15',
            type: 'Avaliação de exames',
            status: 'Confirmada',
            online: true
        }
    ];

    // Dados mockados de consultas passadas
    const pastConsultations = [
        {
            id: 1,
            patient: 'Pedro Almeida',
            age: 56,
            image: 'https://xsgames.co/randomusers/assets/avatars/male/8.jpg',
            date: '20/04/2025',
            time: '10:45',
            type: 'Retorno',
            duration: '28 min',
            hasRecording: true
        },
        {
            id: 2,
            patient: 'Lúcia Costa',
            age: 34,
            image: 'https://xsgames.co/randomusers/assets/avatars/female/9.jpg',
            date: '19/04/2025',
            time: '14:30',
            type: 'Primeira consulta',
            duration: '35 min',
            hasRecording: true
        },
        {
            id: 3,
            patient: 'Roberto Mendes',
            age: 48,
            image: 'https://xsgames.co/randomusers/assets/avatars/male/10.jpg',
            date: '18/04/2025',
            time: '16:00',
            type: 'Avaliação de exames',
            duration: '22 min',
            hasRecording: false
        }
    ];

    const handleDurationChange = (event: SelectChangeEvent) => {
        setMaxDuration(event.target.value as string);
    };

    const toggleAvailability = () => {
        setIsAvailable(!isAvailable);
    };

    const copyLink = () => {
        // Simulação de cópia de link
        console.log('Link copiado');
    };

    // Stats para o dashboard
    const stats = {
        pendingConsultations: 2,
        confirmedConsultations: 4,
        online: true
    };

    const handleCloseConsultation = () => {
        setOpenConsultation(null);
    };

    const handleOpenSettings = () => {
        setOpenSettings(true);
    };

    const handleCloseSettings = () => {
        setOpenSettings(false);
    };

    // Filtrar consultas baseado na aba ativa
    const filteredAppointments = todaysConsultations.filter(consultation => {
        if (selectedTab === 0) return consultation.status === 'Confirmada'; // Próximas
        if (selectedTab === 1) return consultation.status === 'Pendente'; // Realizadas
        return true;
    });

    return (
        <Box>
            <Box sx={{
                display: 'flex',
                flexDirection: isSmall ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: isSmall ? 'flex-start' : 'center',
                mb: isSmall ? 2 : 3,
                gap: isSmall ? 2 : 0
            }}>
                <Typography
                    variant={isExtraSmall ? "h5" : "h4"}
                    component="h1"
                    gutterBottom={isSmall}
                >
                    Telemedicina
                </Typography>
                <Box sx={{
                    display: 'flex',
                    flexDirection: isExtraSmall ? 'column' : 'row',
                    width: isExtraSmall ? '100%' : 'auto',
                    gap: isExtraSmall ? 1 : 0
                }}>
                    <Button
                        variant="outlined"
                        startIcon={<Settings />}
                        sx={{
                            mr: isExtraSmall ? 0 : 1,
                            mb: isExtraSmall ? 1 : 0,
                            width: isExtraSmall ? '100%' : 'auto'
                        }}
                        onClick={handleOpenSettings}
                        size={isExtraSmall ? "small" : "medium"}
                    >
                        Configurações
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/professional/schedule/new?type=telemedicine')}
                        size={isExtraSmall ? "small" : "medium"}
                        sx={{ width: isExtraSmall ? '100%' : 'auto' }}
                    >
                        Nova Teleconsulta
                    </Button>
                </Box>
            </Box>

            <Grid container spacing={isSmall ? 2 : 3}>
                <Grid item xs={12} md={8}>
                    <Paper elevation={2} sx={{ p: 0, overflow: 'hidden' }}>
                        <Tabs
                            value={selectedTab}
                            onChange={handleTabChange}
                            variant="fullWidth"
                        >
                            <Tab icon={<Today />} label="HOJE" />
                            <Tab icon={<Room />} label="SALA VIRTUAL" />
                            <Tab icon={<History />} label="HISTÓRICO" />
                        </Tabs>

                        <Box sx={{ p: isExtraSmall ? 2 : 3 }}>
                            {selectedTab === 0 && (
                                <>
                                    <Box sx={{
                                        display: 'flex',
                                        flexDirection: isExtraSmall ? 'column' : 'row',
                                        justifyContent: 'space-between',
                                        alignItems: isExtraSmall ? 'flex-start' : 'center',
                                        mb: isSmall ? 2 : 3,
                                        gap: isExtraSmall ? 1 : 0
                                    }}>
                                        <Typography variant={isExtraSmall ? "subtitle1" : "h6"}>
                                            Consultas de Hoje
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            startIcon={<PersonAdd />}
                                            size={isExtraSmall ? "small" : "medium"}
                                            sx={{ width: isExtraSmall ? '100%' : 'auto' }}
                                        >
                                            Adicionar Consulta
                                        </Button>
                                    </Box>

                                    {filteredAppointments.map((consultation) => (
                                        <Card key={consultation.id} variant="outlined" sx={{ mb: 2 }}>
                                            <CardContent>
                                                <Box sx={{
                                                    display: 'flex',
                                                    flexDirection: isExtraSmall ? 'column' : 'row',
                                                    justifyContent: 'space-between',
                                                    alignItems: isExtraSmall ? 'flex-start' : 'center',
                                                    gap: isExtraSmall ? 1.5 : 0
                                                }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                                        <Avatar
                                                            src={consultation.image}
                                                            alt={consultation.patient}
                                                            sx={{
                                                                width: isExtraSmall ? 48 : 56,
                                                                height: isExtraSmall ? 48 : 56,
                                                                mr: 2
                                                            }}
                                                        />
                                                        <Box>
                                                            <Typography variant="h6">
                                                                {consultation.patient}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {consultation.age} anos - {consultation.type}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                    <Box sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        width: isExtraSmall ? '100%' : 'auto',
                                                        justifyContent: isExtraSmall ? 'space-between' : 'flex-end'
                                                    }}>
                                                        <Chip
                                                            label={consultation.status}
                                                            color={consultation.status === 'Confirmada' ? 'success' : 'warning'}
                                                            sx={{ mr: 1 }}
                                                        />
                                                        {consultation.online && (
                                                            <Chip
                                                                size="small"
                                                                icon={<SignalWifi4Bar />}
                                                                label="Online"
                                                                color="info"
                                                            />
                                                        )}
                                                    </Box>
                                                </Box>

                                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                                                    <AccessTime fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                                                    <Typography variant="body2">
                                                        {consultation.time}
                                                    </Typography>
                                                </Box>

                                                <Box sx={{
                                                    mt: 2,
                                                    display: 'flex',
                                                    flexDirection: isExtraSmall ? 'column' : 'row',
                                                    gap: isExtraSmall ? 1 : 2
                                                }}>
                                                    <Button
                                                        variant="contained"
                                                        startIcon={<VideoCall />}
                                                        fullWidth
                                                        disabled={!consultation.online}
                                                    >
                                                        Iniciar Consulta
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        startIcon={<Message />}
                                                        fullWidth
                                                    >
                                                        Enviar Mensagem
                                                    </Button>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </>
                            )}

                            {selectedTab === 1 && (
                                <>
                                    <Box sx={{
                                        display: 'flex',
                                        flexDirection: isExtraSmall ? 'column' : 'row',
                                        justifyContent: 'space-between',
                                        alignItems: isExtraSmall ? 'flex-start' : 'center',
                                        mb: isSmall ? 2 : 3,
                                        gap: isExtraSmall ? 1 : 0
                                    }}>
                                        <Typography variant={isExtraSmall ? "subtitle1" : "h6"}>
                                            Sua Sala Virtual
                                        </Typography>
                                        <Chip
                                            label={isAvailable ? 'Disponível' : 'Indisponível'}
                                            color={isAvailable ? 'success' : 'error'}
                                            icon={isAvailable ? <CheckCircle /> : <Warning />}
                                            size={isExtraSmall ? "small" : "medium"}
                                        />
                                    </Box>

                                    <Card variant="outlined" sx={{ mb: 3 }}>
                                        <CardContent>
                                            <Typography variant="subtitle1" gutterBottom>
                                                Configurações da Sala
                                            </Typography>

                                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                                <Grid item xs={12} md={8}>
                                                    <TextField
                                                        fullWidth
                                                        label="Nome da sala"
                                                        value={roomName}
                                                        onChange={(e) => setRoomName(e.target.value)}
                                                        variant="outlined"
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={4}>
                                                    <FormControl fullWidth>
                                                        <InputLabel id="duration-label">Duração máxima</InputLabel>
                                                        <Select
                                                            labelId="duration-label"
                                                            value={maxDuration}
                                                            label="Duração máxima"
                                                            onChange={handleDurationChange}
                                                        >
                                                            <MenuItem value="15">15 minutos</MenuItem>
                                                            <MenuItem value="30">30 minutos</MenuItem>
                                                            <MenuItem value="45">45 minutos</MenuItem>
                                                            <MenuItem value="60">60 minutos</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                            </Grid>

                                            <TextField
                                                fullWidth
                                                disabled
                                                label="Link da sala"
                                                value="https://meet.hospital.com/dr-silva-123"
                                                variant="outlined"
                                                sx={{ mb: 2 }}
                                                InputProps={{
                                                    endAdornment: (
                                                        <IconButton onClick={copyLink}>
                                                            <FileCopy />
                                                        </IconButton>
                                                    )
                                                }}
                                            />

                                            <Box sx={{
                                                display: 'flex',
                                                flexDirection: isExtraSmall ? 'column' : 'row',
                                                justifyContent: 'space-between',
                                                alignItems: isExtraSmall ? 'flex-start' : 'center',
                                                gap: isExtraSmall ? 1 : 0
                                            }}>
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            checked={isAvailable}
                                                            onChange={toggleAvailability}
                                                        />
                                                    }
                                                    label="Disponível para consultas"
                                                />
                                                <Button
                                                    variant="contained"
                                                    startIcon={<VideoCall />}
                                                    disabled={!isAvailable}
                                                >
                                                    Entrar na Sala
                                                </Button>
                                            </Box>
                                        </CardContent>
                                    </Card>

                                    <Box>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Pacientes na Sala de Espera
                                        </Typography>

                                        {todaysConsultations
                                            .filter(consultation => consultation.online)
                                            .map(patient => (
                                                <Card key={patient.id} variant="outlined" sx={{ mb: 2 }}>
                                                    <CardContent sx={{ p: 2 }}>
                                                        <Box sx={{
                                                            display: 'flex',
                                                            flexDirection: isExtraSmall ? 'column' : 'row',
                                                            justifyContent: 'space-between',
                                                            alignItems: isExtraSmall ? 'flex-start' : 'center',
                                                            gap: isExtraSmall ? 1 : 0,
                                                            width: '100%'
                                                        }}>
                                                            <Box sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                width: '100%'
                                                            }}>
                                                                <Avatar
                                                                    src={patient.image}
                                                                    alt={patient.patient}
                                                                    sx={{
                                                                        width: isExtraSmall ? 36 : 40,
                                                                        height: isExtraSmall ? 36 : 40,
                                                                        mr: 2
                                                                    }}
                                                                />
                                                                <Box>
                                                                    <Typography variant="body1">
                                                                        {patient.patient}
                                                                    </Typography>
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        Agendado para {patient.time}
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                            <Button
                                                                variant="contained"
                                                                size="small"
                                                                endIcon={<ArrowForward />}
                                                                sx={{
                                                                    width: isExtraSmall ? '100%' : 'auto',
                                                                    mt: isExtraSmall ? 1 : 0
                                                                }}
                                                            >
                                                                Admitir
                                                            </Button>
                                                        </Box>
                                                    </CardContent>
                                                </Card>
                                            ))}

                                        {todaysConsultations.filter(consultation => consultation.online).length === 0 && (
                                            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                                                Nenhum paciente na sala de espera no momento
                                            </Typography>
                                        )}
                                    </Box>
                                </>
                            )}

                            {selectedTab === 2 && (
                                <>
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        mb: isSmall ? 2 : 3
                                    }}>
                                        <Typography variant={isExtraSmall ? "subtitle1" : "h6"}>
                                            Histórico de Consultas
                                        </Typography>
                                    </Box>

                                    <List>
                                        {pastConsultations.map((consultation) => (
                                            <Card key={consultation.id} variant="outlined" sx={{ mb: 2 }}>
                                                <CardContent>
                                                    <Box sx={{
                                                        display: 'flex',
                                                        alignItems: isExtraSmall ? 'flex-start' : 'center',
                                                        mb: 2,
                                                        flexDirection: isExtraSmall ? 'column' : 'row',
                                                        gap: isExtraSmall ? 1 : 0
                                                    }}>
                                                        <Avatar
                                                            src={consultation.image}
                                                            alt={consultation.patient}
                                                            sx={{
                                                                width: isExtraSmall ? 40 : 48,
                                                                height: isExtraSmall ? 40 : 48,
                                                                mr: isExtraSmall ? 0 : 2,
                                                                mb: isExtraSmall ? 1 : 0
                                                            }}
                                                        />
                                                        <Box sx={{ flexGrow: 1 }}>
                                                            <Typography variant="subtitle1">
                                                                {consultation.patient}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {consultation.age} anos - {consultation.type}
                                                            </Typography>
                                                        </Box>
                                                        <Chip
                                                            size="small"
                                                            label={consultation.duration}
                                                            color="default"
                                                        />
                                                    </Box>

                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                        <EventAvailable fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                                        <Typography variant="body2" color="text.secondary">
                                                            {consultation.date}
                                                        </Typography>
                                                        <AccessTime fontSize="small" sx={{ ml: 2, mr: 1, color: 'text.secondary' }} />
                                                        <Typography variant="body2" color="text.secondary">
                                                            {consultation.time}
                                                        </Typography>
                                                    </Box>

                                                    <Box sx={{
                                                        display: 'flex',
                                                        gap: isExtraSmall ? 1 : 2,
                                                        flexWrap: isExtraSmall ? 'wrap' : 'nowrap'
                                                    }}>
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            startIcon={<Settings />}
                                                        >
                                                            Prontuário
                                                        </Button>
                                                        {consultation.hasRecording && (
                                                            <Button
                                                                variant="outlined"
                                                                size="small"
                                                                startIcon={<History />}
                                                            >
                                                                Ver Gravação
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            startIcon={<Message />}
                                                        >
                                                            Mensagem
                                                        </Button>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </List>
                                </>
                            )}
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Resumo
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Paper elevation={0} sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.light' }}>
                                        <Typography variant="h4" color="warning.dark">
                                            {stats.pendingConsultations}
                                        </Typography>
                                        <Typography variant="body2" color="warning.dark">
                                            Consultas Pendentes
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={6}>
                                    <Paper elevation={0} sx={{ p: 2, textAlign: 'center', bgcolor: 'success.light' }}>
                                        <Typography variant="h4" color="success.dark">
                                            {stats.confirmedConsultations}
                                        </Typography>
                                        <Typography variant="body2" color="success.dark">
                                            Consultas Confirmadas
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>

                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 3 }}>
                                <Typography variant="body1">
                                    Status de Conexão
                                </Typography>
                                <Chip
                                    icon={stats.online ? <SignalWifi4Bar /> : <SignalWifiOff />}
                                    label={stats.online ? 'Conectado' : 'Desconectado'}
                                    color={stats.online ? 'success' : 'error'}
                                    size="small"
                                />
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
                                <Typography variant="body1">
                                    Disponibilidade
                                </Typography>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={isAvailable}
                                            onChange={toggleAvailability}
                                            size="small"
                                        />
                                    }
                                    label=""
                                />
                            </Box>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Mensagens dos Pacientes
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            <List>
                                {['Maria Oliveira', 'João Santos', 'Ana Ferreira'].map((name, index) => (
                                    <ListItem key={index} sx={{ px: 0 }}>
                                        <ListItemAvatar>
                                            <Badge
                                                color="error"
                                                variant="dot"
                                                invisible={index !== 0}
                                            >
                                                <Avatar
                                                    src={`https://xsgames.co/randomusers/assets/avatars/${index % 2 === 0 ? 'female' : 'male'}/${index + 5}.jpg`}
                                                />
                                            </Badge>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={name}
                                            secondary={[
                                                "Gostaria de saber se preciso levar meus exames...",
                                                "Posso remarcar minha consulta para amanhã?",
                                                "Os remédios que o senhor receitou funcionaram bem!"
                                            ][index]}
                                            primaryTypographyProps={{ variant: 'body1' }}
                                            secondaryTypographyProps={{
                                                variant: 'body2',
                                                noWrap: true
                                            }}
                                        />
                                        <ListItemSecondaryAction>
                                            <IconButton size="small">
                                                <Send fontSize="small" />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))}
                            </List>

                            <Button
                                variant="outlined"
                                fullWidth
                                startIcon={<Message />}
                                sx={{ mt: 2 }}
                            >
                                Ver Todas as Mensagens
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Diálogo de Consulta */}
            <Dialog
                open={!!openConsultation}
                onClose={handleCloseConsultation}
                maxWidth="md"
                fullWidth
                sx={{
                    '& .MuiDialog-paper': {
                        m: isExtraSmall ? 1 : 2,
                        width: isExtraSmall ? 'calc(100% - 16px)' : undefined
                    }
                }}
            >
                {openConsultation && (
                    <>
                        <DialogTitle>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6">
                                    Teleconsulta com {openConsultation.patientName}
                                </Typography>
                                <IconButton onClick={handleCloseConsultation} size="small">
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                        </DialogTitle>
                        <DialogContent sx={{ p: isExtraSmall ? 2 : 3 }}>
                            <Paper
                                sx={{
                                    height: isExtraSmall ? 250 : 400,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    bgcolor: 'black',
                                    color: 'white',
                                    mb: 2,
                                    borderRadius: 1
                                }}
                            >
                                <Typography variant="h5">
                                    <Videocam fontSize="large" sx={{ mr: 1, verticalAlign: 'middle' }} />
                                    Simulação de chamada de vídeo
                                </Typography>
                            </Paper>

                            <Grid container spacing={isExtraSmall ? 1.5 : 2}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Anotações da Consulta"
                                        multiline
                                        rows={4}
                                        fullWidth
                                        variant="outlined"
                                        placeholder="Registre suas observações durante a consulta..."
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Typography variant="subtitle1" gutterBottom>
                                                Informações do Paciente
                                            </Typography>
                                            <Box sx={{ mb: 1 }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Motivo da Consulta:
                                                </Typography>
                                                <Typography variant="body2">
                                                    {openConsultation.reason}
                                                </Typography>
                                            </Box>
                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                startIcon={<PeopleAlt />}
                                                sx={{ mt: 1 }}
                                                onClick={() => navigate(`/professional/patients/${openConsultation.patientId}`)}
                                            >
                                                Ver Prontuário Completo
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseConsultation} color="error" variant="outlined" startIcon={<CancelIcon />}>
                                Encerrar Teleconsulta
                            </Button>
                            <Button
                                color="primary"
                                variant="contained"
                                startIcon={<CheckIcon />}
                                onClick={() => {
                                    navigate(`/professional/records/new?patientId=${openConsultation.patientId}`);
                                    handleCloseConsultation();
                                }}
                            >
                                Finalizar e Registrar Atendimento
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>

            {/* Diálogo de Configurações */}
            <Dialog
                open={openSettings}
                onClose={handleCloseSettings}
                maxWidth="sm"
                fullWidth
                sx={{
                    '& .MuiDialog-paper': {
                        m: isExtraSmall ? 1 : 2,
                        width: isExtraSmall ? 'calc(100% - 16px)' : undefined
                    }
                }}
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6">
                            Configurações de Telemedicina
                        </Typography>
                        <IconButton onClick={handleCloseSettings} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ p: isExtraSmall ? 2 : 3 }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ mt: isExtraSmall ? 0.5 : 1 }}>
                        Disponibilidade para Teleconsultas
                    </Typography>
                    <Grid container spacing={isExtraSmall ? 1.5 : 2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Horário de Início"
                                type="time"
                                defaultValue="08:00"
                                InputLabelProps={{ shrink: true }}
                                sx={{ mb: 2 }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Horário de Término"
                                type="time"
                                defaultValue="18:00"
                                InputLabelProps={{ shrink: true }}
                                sx={{ mb: 2 }}
                            />
                        </Grid>
                    </Grid>

                    <TextField
                        fullWidth
                        label="Duração padrão das consultas"
                        select
                        SelectProps={{ native: true }}
                        defaultValue="30"
                        sx={{ mb: 2 }}
                    >
                        <option value="15">15 minutos</option>
                        <option value="30">30 minutos</option>
                        <option value="45">45 minutos</option>
                        <option value="60">60 minutos</option>
                    </TextField>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="subtitle1" gutterBottom>
                        Configurações de Áudio e Vídeo
                    </Typography>

                    <TextField
                        fullWidth
                        label="Dispositivo de Câmera"
                        select
                        SelectProps={{ native: true }}
                        defaultValue="default"
                        sx={{ mb: 2 }}
                    >
                        <option value="default">Câmera padrão</option>
                        <option value="webcam1">Webcam externa</option>
                    </TextField>

                    <TextField
                        fullWidth
                        label="Dispositivo de Áudio"
                        select
                        SelectProps={{ native: true }}
                        defaultValue="default"
                        sx={{ mb: 2 }}
                    >
                        <option value="default">Microfone padrão</option>
                        <option value="headset">Headset</option>
                    </TextField>

                    <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<Videocam />}
                        sx={{ mt: 1 }}
                    >
                        Testar Dispositivos de Áudio e Vídeo
                    </Button>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseSettings} color="inherit">
                        Cancelar
                    </Button>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={handleCloseSettings}
                    >
                        Salvar Configurações
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ProfessionalTelemedicine; 