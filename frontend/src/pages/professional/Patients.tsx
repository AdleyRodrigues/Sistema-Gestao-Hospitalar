import {
    Add,
    Event,
    FolderOpen,
    MedicalServices,
    MoreVert,
    Person,
    Search
} from '@mui/icons-material';
import {
    Avatar,
    Box,
    Button,
    Chip,
    Divider,
    Grid,
    IconButton,
    InputAdornment,
    Menu,
    MenuItem,
    Paper,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    TextField,
    Typography
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Patient {
    id: number;
    name: string;
    age: number;
    gender: 'M' | 'F';
    healthInsurance: string;
    lastAppointment: string;
    nextAppointment?: string;
    phone: string;
    email: string;
    avatar?: string;
    status: 'active' | 'inactive';
}

const mockPatients: Patient[] = [
    {
        id: 1,
        name: 'Ana Silva',
        age: 42,
        gender: 'F',
        healthInsurance: 'Unimed',
        lastAppointment: '10/08/2023',
        nextAppointment: '15/09/2023',
        phone: '(11) 98765-4321',
        email: 'ana.silva@email.com',
        avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
        status: 'active'
    },
    {
        id: 2,
        name: 'João Santos',
        age: 58,
        gender: 'M',
        healthInsurance: 'Bradesco',
        lastAppointment: '05/08/2023',
        phone: '(11) 91234-5678',
        email: 'joao.santos@email.com',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        status: 'active'
    },
    {
        id: 3,
        name: 'Maria Oliveira',
        age: 35,
        gender: 'F',
        healthInsurance: 'SulAmérica',
        lastAppointment: '20/07/2023',
        nextAppointment: '22/09/2023',
        phone: '(11) 95555-7777',
        email: 'maria.oliveira@email.com',
        avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
        status: 'active'
    },
    {
        id: 4,
        name: 'Pedro Ferreira',
        age: 67,
        gender: 'M',
        healthInsurance: 'Amil',
        lastAppointment: '15/07/2023',
        phone: '(11) 94444-3333',
        email: 'pedro.ferreira@email.com',
        avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
        status: 'inactive'
    },
    {
        id: 5,
        name: 'Carla Souza',
        age: 29,
        gender: 'F',
        healthInsurance: 'Unimed',
        lastAppointment: '01/08/2023',
        nextAppointment: '01/10/2023',
        phone: '(11) 96666-8888',
        email: 'carla.souza@email.com',
        avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
        status: 'active'
    },
];

const ProfessionalPatients = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [tabValue, setTabValue] = useState(0);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

    // Filtros baseados na tab selecionada
    const filteredPatients = mockPatients.filter((patient) => {
        if (tabValue === 0) return true; // Todos
        if (tabValue === 1) return patient.status === 'active'; // Ativos
        if (tabValue === 2) return patient.status === 'inactive'; // Inativos
        if (tabValue === 3) return patient.nextAppointment !== undefined; // Com consulta agendada
        return true;
    }).filter((patient) => {
        // Filtro de pesquisa
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
            patient.name.toLowerCase().includes(term) ||
            patient.email.toLowerCase().includes(term) ||
            patient.phone.includes(term) ||
            patient.healthInsurance.toLowerCase().includes(term)
        );
    });

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, patient: Patient) => {
        setAnchorEl(event.currentTarget);
        setSelectedPatient(patient);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleViewRecord = () => {
        if (selectedPatient) {
            navigate(`/professional/records/${selectedPatient.id}`);
            handleMenuClose();
        }
    };

    const handleScheduleAppointment = () => {
        if (selectedPatient) {
            navigate(`/professional/schedule/new?patientId=${selectedPatient.id}`);
            handleMenuClose();
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Pacientes
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate('/professional/patients/new')}
                >
                    Novo Paciente
                </Button>
            </Box>

            <Paper sx={{ mb: 3, p: 2 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            placeholder="Buscar paciente por nome, e-mail, telefone..."
                            variant="outlined"
                            size="small"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button startIcon={<MedicalServices />} sx={{ mr: 1 }}>
                                Filtros
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            <Paper sx={{ mb: 3 }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    <Tab label="Todos" />
                    <Tab label="Ativos" />
                    <Tab label="Inativos" />
                    <Tab label="Com Consulta Agendada" />
                </Tabs>
            </Paper>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Paciente</TableCell>
                            <TableCell>Idade</TableCell>
                            <TableCell>Convênio</TableCell>
                            <TableCell>Última Consulta</TableCell>
                            <TableCell>Próxima Consulta</TableCell>
                            <TableCell>Contato</TableCell>
                            <TableCell align="center">Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredPatients.map((patient) => (
                            <TableRow key={patient.id} hover>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Avatar src={patient.avatar} sx={{ mr: 2 }}>
                                            {!patient.avatar && <Person />}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="body1">{patient.name}</Typography>
                                            <Chip
                                                size="small"
                                                label={patient.status === 'active' ? 'Ativo' : 'Inativo'}
                                                color={patient.status === 'active' ? 'success' : 'default'}
                                                sx={{ mt: 0.5 }}
                                            />
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    {patient.age} anos ({patient.gender === 'M' ? 'Masculino' : 'Feminino'})
                                </TableCell>
                                <TableCell>{patient.healthInsurance}</TableCell>
                                <TableCell>{patient.lastAppointment}</TableCell>
                                <TableCell>
                                    {patient.nextAppointment || '-'}
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">{patient.phone}</Typography>
                                    <Typography variant="body2" color="textSecondary">{patient.email}</Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton
                                        onClick={(e) => handleMenuOpen(e, patient)}
                                        size="small"
                                    >
                                        <MoreVert />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredPatients.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                                    <Typography variant="body1" color="textSecondary">
                                        Nenhum paciente encontrado com os critérios selecionados.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleViewRecord}>
                    <FolderOpen fontSize="small" sx={{ mr: 1 }} />
                    Ver Prontuário
                </MenuItem>
                <MenuItem onClick={handleScheduleAppointment}>
                    <Event fontSize="small" sx={{ mr: 1 }} />
                    Agendar Consulta
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleMenuClose}>
                    <MedicalServices fontSize="small" sx={{ mr: 1 }} />
                    Novo Atendimento
                </MenuItem>
            </Menu>
        </Box>
    );
};

export default ProfessionalPatients; 