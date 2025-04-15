import { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    TextField,
    InputAdornment,
    Grid,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tabs,
    Tab,
    Avatar,
    Chip,
    Menu,
    MenuItem,
    Divider,
    ListItemIcon,
    Card,
    CardContent,
    CardHeader
} from '@mui/material';
import {
    Search as SearchIcon,
    FilterList as FilterListIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Visibility as VisibilityIcon,
    Person as PersonIcon,
    MedicalServices as MedicalServicesIcon,
    Biotech as BiotechIcon,
    LocalHospital as LocalHospitalIcon,
    Assignment as AssignmentIcon,
    AccessTime as AccessTimeIcon,
    Event as EventIcon,
    MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface MedicalRecord {
    id: number;
    patientId: number;
    patientName: string;
    patientAvatar?: string;
    date: string;
    type: 'Consulta' | 'Exame' | 'Cirurgia' | 'Retorno';
    diagnosis: string;
    prescription?: string;
    notes?: string;
    status: 'Concluído' | 'Em andamento' | 'Agendado';
}

const mockRecords: MedicalRecord[] = [
    {
        id: 1,
        patientId: 1,
        patientName: "Ana Silva",
        patientAvatar: "https://randomuser.me/api/portraits/women/1.jpg",
        date: "10/08/2023",
        type: "Consulta",
        diagnosis: "Hipertensão arterial controlada",
        prescription: "Losartana 50mg - 1 comprimido por dia",
        notes: "Paciente relatou melhora na pressão após início da atividade física",
        status: "Concluído"
    },
    {
        id: 2,
        patientId: 2,
        patientName: "João Santos",
        patientAvatar: "https://randomuser.me/api/portraits/men/1.jpg",
        date: "05/08/2023",
        type: "Exame",
        diagnosis: "Glicemia elevada",
        prescription: "Metformina 850mg - 2 comprimidos por dia",
        notes: "Encaminhado para nutricionista",
        status: "Concluído"
    },
    {
        id: 3,
        patientId: 3,
        patientName: "Maria Oliveira",
        patientAvatar: "https://randomuser.me/api/portraits/women/2.jpg",
        date: "15/08/2023",
        type: "Retorno",
        diagnosis: "Ansiedade",
        prescription: "Escitalopram 10mg - 1 comprimido por dia",
        notes: "Paciente relatou melhora nos sintomas de ansiedade",
        status: "Em andamento"
    },
    {
        id: 4,
        patientId: 4,
        patientName: "Pedro Ferreira",
        patientAvatar: "https://randomuser.me/api/portraits/men/2.jpg",
        date: "22/08/2023",
        type: "Cirurgia",
        diagnosis: "Hérnia inguinal bilateral",
        notes: "Procedimento cirúrgico agendado",
        status: "Agendado"
    },
    {
        id: 5,
        patientId: 5,
        patientName: "Carla Souza",
        patientAvatar: "https://randomuser.me/api/portraits/women/3.jpg",
        date: "18/08/2023",
        type: "Consulta",
        diagnosis: "Cefaleia tensional",
        prescription: "Dipirona 1g - em caso de dor",
        notes: "Orientada a reduzir tempo de exposição a telas",
        status: "Concluído"
    }
];

export default function ProfessionalRecords() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [tabValue, setTabValue] = useState(0);
    const [recordDialogOpen, setRecordDialogOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    // Filtrar prontuários baseado na aba selecionada
    const filteredRecords = mockRecords.filter((record) => {
        if (tabValue === 0) return true; // Todos prontuários
        if (tabValue === 1) return record.status === 'Concluído';
        if (tabValue === 2) return record.status === 'Em andamento';
        if (tabValue === 3) return record.status === 'Agendado';
        return true;
    }).filter((record) => {
        // Filtro de pesquisa
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
            record.patientName.toLowerCase().includes(term) ||
            record.diagnosis.toLowerCase().includes(term) ||
            record.type.toLowerCase().includes(term)
        );
    });

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleRecordView = (record: MedicalRecord) => {
        setSelectedRecord(record);
        setRecordDialogOpen(true);
    };

    const handleRecordEdit = (recordId: number) => {
        navigate(`/professional/records/edit/${recordId}`);
    };

    const handleRecordClose = () => {
        setRecordDialogOpen(false);
        setSelectedRecord(null);
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, record: MedicalRecord) => {
        setAnchorEl(event.currentTarget);
        setSelectedRecord(record);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Concluído':
                return 'success';
            case 'Em andamento':
                return 'warning';
            case 'Agendado':
                return 'info';
            default:
                return 'default';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'Consulta':
                return <MedicalServicesIcon />;
            case 'Exame':
                return <BiotechIcon />;
            case 'Cirurgia':
                return <LocalHospitalIcon />;
            case 'Retorno':
                return <AssignmentIcon />;
            default:
                return <AssignmentIcon />;
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Prontuários
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/professional/records/new')}
                >
                    Novo Prontuário
                </Button>
            </Box>

            <Paper sx={{ mb: 3, p: 2 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            placeholder="Buscar por paciente, diagnóstico ou tipo de atendimento..."
                            variant="outlined"
                            size="small"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button startIcon={<FilterListIcon />} sx={{ mr: 1 }}>
                                Filtros Avançados
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
                    <Tab label="Concluídos" />
                    <Tab label="Em andamento" />
                    <Tab label="Agendados" />
                </Tabs>
            </Paper>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Paciente</TableCell>
                            <TableCell>Data</TableCell>
                            <TableCell>Tipo</TableCell>
                            <TableCell>Diagnóstico</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="center">Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredRecords.map((record) => (
                            <TableRow key={record.id} hover>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Avatar src={record.patientAvatar} sx={{ mr: 2 }}>
                                            {!record.patientAvatar && <PersonIcon />}
                                        </Avatar>
                                        <Typography variant="body1">
                                            {record.patientName}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>{record.date}</TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <ListItemIcon sx={{ minWidth: 30 }}>
                                            {getTypeIcon(record.type)}
                                        </ListItemIcon>
                                        {record.type}
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ maxWidth: 200 }}>
                                    <Typography noWrap variant="body2">
                                        {record.diagnosis}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={record.status}
                                        color={getStatusColor(record.status) as any}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton
                                        onClick={() => handleRecordView(record)}
                                        size="small"
                                        sx={{ mr: 1 }}
                                    >
                                        <VisibilityIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                        onClick={(e) => handleMenuOpen(e, record)}
                                        size="small"
                                    >
                                        <MoreVertIcon fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredRecords.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                    <Typography variant="body1" color="textSecondary">
                                        Nenhum prontuário encontrado com os critérios selecionados.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Menu de opções para cada prontuário */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={() => {
                    if (selectedRecord) handleRecordEdit(selectedRecord.id);
                    handleMenuClose();
                }}>
                    <EditIcon fontSize="small" sx={{ mr: 1 }} />
                    Editar Prontuário
                </MenuItem>
                <MenuItem onClick={() => {
                    if (selectedRecord) navigate(`/professional/patients/${selectedRecord.patientId}`);
                    handleMenuClose();
                }}>
                    <PersonIcon fontSize="small" sx={{ mr: 1 }} />
                    Ver Perfil do Paciente
                </MenuItem>
                <MenuItem onClick={() => {
                    if (selectedRecord) navigate(`/professional/schedule/new?patientId=${selectedRecord.patientId}`);
                    handleMenuClose();
                }}>
                    <EventIcon fontSize="small" sx={{ mr: 1 }} />
                    Agendar Consulta
                </MenuItem>
            </Menu>

            {/* Diálogo para visualizar prontuário */}
            <Dialog
                open={recordDialogOpen}
                onClose={handleRecordClose}
                maxWidth="md"
                fullWidth
            >
                {selectedRecord && (
                    <>
                        <DialogTitle>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar src={selectedRecord.patientAvatar} sx={{ mr: 2 }}>
                                    {!selectedRecord.patientAvatar && <PersonIcon />}
                                </Avatar>
                                <Box>
                                    <Typography variant="h6">
                                        Prontuário de {selectedRecord.patientName}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {selectedRecord.date} - {selectedRecord.type}
                                    </Typography>
                                </Box>
                            </Box>
                        </DialogTitle>
                        <DialogContent dividers>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Card variant="outlined">
                                        <CardHeader
                                            title="Informações do Atendimento"
                                            avatar={<AccessTimeIcon color="primary" />}
                                        />
                                        <Divider />
                                        <CardContent>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} md={6}>
                                                    <Box sx={{ mb: 2 }}>
                                                        <Typography variant="subtitle2" color="textSecondary">
                                                            Status
                                                        </Typography>
                                                        <Chip
                                                            label={selectedRecord.status}
                                                            color={getStatusColor(selectedRecord.status) as any}
                                                            size="small"
                                                            sx={{ mt: 1 }}
                                                        />
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <Box sx={{ mb: 2 }}>
                                                        <Typography variant="subtitle2" color="textSecondary">
                                                            Tipo de Atendimento
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                            {getTypeIcon(selectedRecord.type)}
                                                            <Typography sx={{ ml: 1 }}>
                                                                {selectedRecord.type}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid item xs={12}>
                                    <Card variant="outlined">
                                        <CardHeader
                                            title="Diagnóstico"
                                            avatar={<LocalHospitalIcon color="error" />}
                                        />
                                        <Divider />
                                        <CardContent>
                                            <Typography>
                                                {selectedRecord.diagnosis}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                {selectedRecord.prescription && (
                                    <Grid item xs={12}>
                                        <Card variant="outlined">
                                            <CardHeader
                                                title="Prescrição"
                                                avatar={<MedicalServicesIcon color="info" />}
                                            />
                                            <Divider />
                                            <CardContent>
                                                <Typography>
                                                    {selectedRecord.prescription}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                )}

                                {selectedRecord.notes && (
                                    <Grid item xs={12}>
                                        <Card variant="outlined">
                                            <CardHeader
                                                title="Anotações"
                                                avatar={<AssignmentIcon color="success" />}
                                            />
                                            <Divider />
                                            <CardContent>
                                                <Typography>
                                                    {selectedRecord.notes}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                )}
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleRecordClose}>Fechar</Button>
                            <Button
                                variant="contained"
                                startIcon={<EditIcon />}
                                onClick={() => {
                                    handleRecordEdit(selectedRecord.id);
                                    handleRecordClose();
                                }}
                            >
                                Editar
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Box>
    );
} 