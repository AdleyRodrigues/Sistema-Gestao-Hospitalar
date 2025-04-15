import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Button,
    Card,
    CardContent,
    Divider,
    Chip,
    Avatar,
    TextField,
    Stepper,
    Step,
    StepLabel,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Tab,
    Tabs
} from '@mui/material';
import {
    VideoCall,
    EventAvailable,
    AccessTime,
    History,
    MedicalServices,
    Videocam,
    Search,
    Event,
    Description,
    Info
} from '@mui/icons-material';

const PatientTelemedicine = () => {
    const [selectedTab, setSelectedTab] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue);
    };

    // Dados mockados de teleconsultas
    const upcomingAppointments = [
        {
            id: 1,
            doctor: 'Dra. Ana Souza',
            specialty: 'Cardiologia',
            image: 'https://xsgames.co/randomusers/assets/avatars/female/3.jpg',
            date: '22/04/2025',
            time: '14:30',
            status: 'Agendada'
        },
        {
            id: 2,
            doctor: 'Dr. Ricardo Mendes',
            specialty: 'Clínico Geral',
            image: 'https://xsgames.co/randomusers/assets/avatars/male/4.jpg',
            date: '28/04/2025',
            time: '15:45',
            status: 'Agendada'
        }
    ];

    const pastAppointments = [
        {
            id: 1,
            doctor: 'Dr. Paulo Oliveira',
            specialty: 'Ortopedia',
            image: 'https://xsgames.co/randomusers/assets/avatars/male/5.jpg',
            date: '15/03/2025',
            time: '16:00',
            status: 'Concluída'
        },
        {
            id: 2,
            doctor: 'Dra. Maria Santos',
            specialty: 'Dermatologia',
            image: 'https://xsgames.co/randomusers/assets/avatars/female/4.jpg',
            date: '28/02/2025',
            time: '11:30',
            status: 'Concluída'
        },
    ];

    const specialties = [
        { id: 1, name: 'Cardiologia' },
        { id: 2, name: 'Dermatologia' },
        { id: 3, name: 'Ortopedia' },
        { id: 4, name: 'Clínico Geral' },
        { id: 5, name: 'Pediatria' },
        { id: 6, name: 'Psiquiatria' }
    ];

    const [searchTerm, setSearchTerm] = useState('');
    const [activeStep, setActiveStep] = useState(0);

    const steps = ['Selecionar especialidade', 'Escolher profissional', 'Agendar data/hora', 'Confirmar'];

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
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
                            onChange={handleTabChange}
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

                                    {upcomingAppointments.map((appointment) => (
                                        <Card key={appointment.id} variant="outlined" sx={{ mb: 2 }}>
                                            <CardContent>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Avatar
                                                            src={appointment.image}
                                                            alt={appointment.doctor}
                                                            sx={{ width: 56, height: 56, mr: 2 }}
                                                        />
                                                        <Box>
                                                            <Typography variant="h6">
                                                                {appointment.doctor}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {appointment.specialty}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                    <Chip
                                                        label={appointment.status}
                                                        color="primary"
                                                    />
                                                </Box>

                                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                                                    <Event fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                                                    <Typography variant="body2">
                                                        {appointment.date}
                                                    </Typography>
                                                    <AccessTime fontSize="small" sx={{ ml: 2, mr: 1, color: 'primary.main' }} />
                                                    <Typography variant="body2">
                                                        {appointment.time}
                                                    </Typography>
                                                </Box>

                                                <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                                                    <Button
                                                        variant="contained"
                                                        startIcon={<VideoCall />}
                                                        fullWidth
                                                    >
                                                        Entrar na Sala
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        startIcon={<Description />}
                                                        fullWidth
                                                    >
                                                        Preparação
                                                    </Button>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    ))}

                                    <Box sx={{ mt: 4 }}>
                                        <Typography variant="h6" gutterBottom>
                                            Histórico de Consultas
                                        </Typography>
                                        <Divider sx={{ mb: 2 }} />

                                        {pastAppointments.map((appointment) => (
                                            <Card key={appointment.id} variant="outlined" sx={{ mb: 2 }}>
                                                <CardContent>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Avatar
                                                                src={appointment.image}
                                                                alt={appointment.doctor}
                                                                sx={{ width: 48, height: 48, mr: 2 }}
                                                            />
                                                            <Box>
                                                                <Typography variant="subtitle1">
                                                                    {appointment.doctor}
                                                                </Typography>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    {appointment.specialty}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                        <Chip
                                                            size="small"
                                                            label={appointment.status}
                                                            color="success"
                                                        />
                                                    </Box>

                                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                                                        <AccessTime fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                                        <Typography variant="body2" color="text.secondary">
                                                            {appointment.date} às {appointment.time}
                                                        </Typography>
                                                    </Box>

                                                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            startIcon={<MedicalServices />}
                                                        >
                                                            Ver Resumo
                                                        </Button>
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            startIcon={<History />}
                                                        >
                                                            Ver Gravação
                                                        </Button>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </Box>
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

                                    <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                                        {steps.map((label) => (
                                            <Step key={label}>
                                                <StepLabel>{label}</StepLabel>
                                            </Step>
                                        ))}
                                    </Stepper>

                                    <Box>
                                        {activeStep === 0 && (
                                            <Box>
                                                <TextField
                                                    fullWidth
                                                    variant="outlined"
                                                    label="Pesquisar especialidade"
                                                    placeholder="Ex: Cardiologia, Ortopedia..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    InputProps={{
                                                        startAdornment: <Search color="action" sx={{ mr: 1 }} />,
                                                    }}
                                                    sx={{ mb: 3 }}
                                                />

                                                <Grid container spacing={2}>
                                                    {specialties
                                                        .filter(spec =>
                                                            spec.name.toLowerCase().includes(searchTerm.toLowerCase())
                                                        )
                                                        .map((specialty) => (
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
                                                                    onClick={handleNext}
                                                                >
                                                                    <Typography variant="h6">{specialty.name}</Typography>
                                                                </Card>
                                                            </Grid>
                                                        ))}
                                                </Grid>
                                            </Box>
                                        )}

                                        {activeStep === 1 && (
                                            <Box>
                                                <TextField
                                                    fullWidth
                                                    variant="outlined"
                                                    label="Pesquisar médico"
                                                    placeholder="Digite o nome do médico"
                                                    InputProps={{
                                                        startAdornment: <Search color="action" sx={{ mr: 1 }} />,
                                                    }}
                                                    sx={{ mb: 3 }}
                                                />

                                                <List>
                                                    {[1, 2, 3].map((item) => (
                                                        <ListItem
                                                            key={item}
                                                            alignItems="flex-start"
                                                            sx={{
                                                                mb: 2,
                                                                border: '1px solid #e0e0e0',
                                                                borderRadius: 1,
                                                                cursor: 'pointer',
                                                                '&:hover': {
                                                                    bgcolor: 'rgba(0, 0, 0, 0.04)'
                                                                }
                                                            }}
                                                            onClick={handleNext}
                                                        >
                                                            <ListItemAvatar>
                                                                <Avatar src={`https://xsgames.co/randomusers/assets/avatars/${item % 2 === 0 ? 'male' : 'female'}/${item + 3}.jpg`} />
                                                            </ListItemAvatar>
                                                            <ListItemText
                                                                primary={`${item % 2 === 0 ? 'Dr.' : 'Dra.'} ${['Ricardo Mendes', 'Ana Souza', 'Paulo Oliveira'][item - 1]}`}
                                                                secondary={
                                                                    <>
                                                                        <Typography variant="body2" component="span">
                                                                            {['Cardiologia', 'Cardiologia', 'Cardiologia'][item - 1]}
                                                                        </Typography>
                                                                        <br />
                                                                        <Typography variant="body2" component="span" color="text.secondary">
                                                                            Próxima disponibilidade: {['Hoje, 16:00', 'Amanhã, 10:30', 'Sexta, 14:15'][item - 1]}
                                                                        </Typography>
                                                                    </>
                                                                }
                                                            />
                                                            <Chip
                                                                label={`${['4.8', '4.9', '4.7'][item - 1]} ★`}
                                                                size="small"
                                                                color="primary"
                                                                variant="outlined"
                                                                sx={{ ml: 2, alignSelf: 'center' }}
                                                            />
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            </Box>
                                        )}

                                        {activeStep === 2 && (
                                            <Box>
                                                <Typography variant="subtitle1" gutterBottom>
                                                    Dra. Ana Souza - Cardiologia
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                                    Selecione uma data e horário disponível
                                                </Typography>

                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} sm={6}>
                                                        <Typography variant="subtitle2" gutterBottom>
                                                            Hoje - 22/04/2025
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                            {['14:00', '15:30', '16:45', '18:00'].map((time) => (
                                                                <Chip
                                                                    key={time}
                                                                    label={time}
                                                                    onClick={handleNext}
                                                                    sx={{
                                                                        cursor: 'pointer',
                                                                        '&:hover': {
                                                                            bgcolor: 'primary.main',
                                                                            color: 'white'
                                                                        }
                                                                    }}
                                                                />
                                                            ))}
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <Typography variant="subtitle2" gutterBottom>
                                                            Amanhã - 23/04/2025
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                            {['09:30', '10:45', '11:15', '14:30', '16:00'].map((time) => (
                                                                <Chip
                                                                    key={time}
                                                                    label={time}
                                                                    onClick={handleNext}
                                                                    sx={{
                                                                        cursor: 'pointer',
                                                                        '&:hover': {
                                                                            bgcolor: 'primary.main',
                                                                            color: 'white'
                                                                        }
                                                                    }}
                                                                />
                                                            ))}
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        )}

                                        {activeStep === 3 && (
                                            <Box>
                                                <Typography variant="h6" gutterBottom>
                                                    Confirmar agendamento
                                                </Typography>

                                                <Card variant="outlined" sx={{ mb: 3 }}>
                                                    <CardContent>
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} sm={6}>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    Médico
                                                                </Typography>
                                                                <Typography variant="body1" sx={{ mb: 2 }}>
                                                                    Dra. Ana Souza
                                                                </Typography>

                                                                <Typography variant="body2" color="text.secondary">
                                                                    Especialidade
                                                                </Typography>
                                                                <Typography variant="body1" sx={{ mb: 2 }}>
                                                                    Cardiologia
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={12} sm={6}>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    Data
                                                                </Typography>
                                                                <Typography variant="body1" sx={{ mb: 2 }}>
                                                                    22/04/2025
                                                                </Typography>

                                                                <Typography variant="body2" color="text.secondary">
                                                                    Horário
                                                                </Typography>
                                                                <Typography variant="body1">
                                                                    14:00
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>

                                                        <Divider sx={{ my: 2 }} />

                                                        <Typography variant="body2" color="text.secondary">
                                                            Valor
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                            <Typography variant="body1">
                                                                Teleconsulta
                                                            </Typography>
                                                            <Typography variant="body1" fontWeight="bold">
                                                                R$ 180,00
                                                            </Typography>
                                                        </Box>
                                                    </CardContent>
                                                </Card>

                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    size="large"
                                                    fullWidth
                                                    onClick={handleReset}
                                                >
                                                    Confirmar e Pagar
                                                </Button>
                                            </Box>
                                        )}

                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                                            <Button
                                                disabled={activeStep === 0}
                                                onClick={handleBack}
                                            >
                                                Voltar
                                            </Button>
                                            {activeStep < 3 && <Button onClick={handleNext} disabled={activeStep === 3}>
                                                {activeStep === steps.length - 1 ? 'Finalizar' : 'Próximo'}
                                            </Button>}
                                        </Box>
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

                        {upcomingAppointments.length > 0 ? (
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
                                    <Event fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
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
                                    startIcon={<VideoCall />}
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
        </Box>
    );
};

export default PatientTelemedicine; 